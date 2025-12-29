import express from "express";
import "dotenv/config";
import dbConnect from "./db/index.js";
import userRouter from "./routes/user.route.js";
import cors from "cors";
import serviceRouter from "./routes/service.route.js";
import blogRouter from "./routes/blog.route.js";
import { configureCloudinary } from "./utils/cloudinary.js";
import sessionRouter from "./routes/session.route.js";
import verifyAdmin from "./middlewares/verifyAdmin.js";
import { createAdmin, dashboard, sendAccommodationEmail, sendContactEmail, sendLsatSessionEmail, sendOrderEmail } from "./controllers/other.controller.js";
import Stripe from "stripe";
import axios from "axios";
import compression from "compression";
import Session from "./models/session.model.js";
import couponRouter from "./routes/coupon.route.js";
import addonRouter from "./routes/addon.route.js";
import extraRouter from "./routes/extra.route.js";
import packageRouter from "./routes/package.router.js";
import teamRouter from "./routes/team.routes.js";
import accommodationRouter from "./routes/accommodation.route.js";
import Accommodation from "./models/accommodation.model.js";
import mongoose from "mongoose";
import otherRouter from "./routes/other.route.js";
import tutorRouter from "./routes/tutor.route.js";
import LSATPackagePurchase from "./models/lsatpackagepurchase.model.js";
import lsatPackageRouter from "./routes/lsatpackage.route.js";
import lsatSessionRouter from "./routes/lsatsession.route.js";
import googleRouter from "./routes/google.route.js";

const app = express();
app.use(compression());
dbConnect();
configureCloudinary();

const stripe = Stripe(`${process.env.STRIPE_SECRET_KEY}`);
const PORT = process.env.PORT || 3000;

// app.post(
//   "/stripe-webhook",
//   express.raw({ type: "application/json" }),
//   async (req, res) => {
//     const sig = req.headers["stripe-signature"];
//     let event;

//     try {
//       event = stripe.webhooks.constructEvent(
//         req.body,
//         sig,
//         process.env.STRIPE_WEBHOOK_SECRET
//       );
//     } catch (err) {
//       console.log("Webhook signature verification failed:", err.message);
//       return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object;
//       const sessionId = session.client_reference_id;

//       try {
//         const sessionUpdated = await Session.findByIdAndUpdate(sessionId, { payment: true }, { new: true });
//         console.log("Payment updated for session:", sessionId);

//         if (!sessionUpdated) {
//           await Accommodation.findByIdAndUpdate(sessionId, { payment: true }, { new: true });
//           console.log("Payment updated for accommodation:", sessionId);
//         }
//       } catch (err) {
//         console.error("Error updating payment:", err);
//       }
//     }

//     res.sendStatus(200);
//   }
// );

app.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const sessionId = session.client_reference_id;
      const metadata = session.metadata;

      try {
        // Check if it's a package purchase
        if (metadata && metadata.type === 'package') {
          const purchaseId = metadata.purchaseId;

          // Update package purchase status
          await LSATPackagePurchase.findByIdAndUpdate(
            purchaseId,
            {
              status: 'active',
              stripePaymentIntentId: session.payment_intent
            },
            { new: true }
          );

          console.log("Package purchase activated:", purchaseId);

          // Send confirmation email for package
          // await sendPackageConfirmationEmail(metadata.userEmail, metadata.packageId, purchaseId);

        }
        // Check if it's a session
        else {
          const sessionUpdated = await Session.findByIdAndUpdate(
            sessionId,
            { payment: true },
            { new: true }
          );

          if (sessionUpdated) {
            console.log("Payment updated for session:", sessionId);
          } else {
            // Check if it's an accommodation
            await Accommodation.findByIdAndUpdate(
              sessionId,
              { payment: true },
              { new: true }
            );
            console.log("Payment updated for accommodation:", sessionId);
          }
        }
      } catch (err) {
        console.error("Error updating payment:", err);
      }
    }

    res.sendStatus(200);
  }
);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ limit: '16kb' }));

const allowedOrigins = ['https://www.jdmentors.com', 'http://localhost:5173'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests like Postman
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
app.use('/api/v1/users', userRouter);
app.use('/api/v1/services', serviceRouter);
app.use('/api/v1/addons', addonRouter);
app.use('/api/v1/extras', extraRouter);
app.use('/api/v1/packages', packageRouter);
app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/sessions', sessionRouter);
app.use('/api/v1/accommodations', accommodationRouter);
app.use('/api/v1/coupons', couponRouter);
app.use('/api/v1/team', teamRouter);
app.get('/api/v1/dashboard', verifyAdmin, dashboard);
app.post('/api/v1/admin/register', verifyAdmin, createAdmin);
app.use('/api/v1/others', otherRouter);
app.use('/api/v1/tutors', tutorRouter);
app.use('/api/v1/lsat-packages', lsatPackageRouter);
app.use('/api/v1/lsat-sessions', lsatSessionRouter);
app.use('/api/v1/google', googleRouter);

app.post('/create-checkout-session', async (req, res) => {
  const { sessionId } = req.body;

  const { data } = await axios.get(`${process.env.BACKEND_URL}/api/v1/sessions/single/${sessionId}`);

  if (!data) {
    return res.status(500).json({ success: false, message: 'Session not found' });
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${data.data.service.title}`,
          },
          unit_amount: Math.round(Number(data.data.price)) * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/checkout-success/${sessionId}`,
    cancel_url: `${process.env.FRONTEND_URL}/checkout-cancel`,
    client_reference_id: sessionId
  });

  res.json({ url: session.url });
});

app.post('/create-checkout-accommodation', async (req, res) => {
  const { accommodationId } = req.body;

  const { data } = await axios.get(`${process.env.BACKEND_URL}/api/v1/accommodations/single/${accommodationId}`);

  if (!data) {
    return res.status(500).json({ success: false, message: 'Accommodation not found' });
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `accommodation`,
          },
          unit_amount: Math.round(Number(data.data.price)) * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/checkout-accommodation-success/${accommodationId}`,
    cancel_url: `${process.env.FRONTEND_URL}/checkout-cancel`,
    client_reference_id: accommodationId
  });

  res.json({ url: session.url });
});

app.post('/create-checkout-session-package', async (req, res) => {
  try {
    const { packageId, purchaseId, userEmail, userName } = req.body;

    // Fetch package details from your backend
    const { data } = await axios.get(`${process.env.BACKEND_URL}/api/v1/lsat-packages/single/${packageId}`);

    if (!data || !data.success) {
      return res.status(500).json({ success: false, message: 'Package not found' });
    }

    const lsatPackage = data.data;

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${lsatPackage.title} - LSAT Tutoring Package`,
              description: `${lsatPackage.sessions} session${lsatPackage.sessions > 1 ? 's' : ''} - ${lsatPackage.description}`,
              metadata: {
                package_id: packageId,
                purchase_id: purchaseId,
                sessions: lsatPackage.sessions,
                duration: lsatPackage.duration
              }
            },
            unit_amount: Math.round(Number(lsatPackage.price)) * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/checkout-lsat-package-success/${purchaseId}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout-cancel`,
      client_reference_id: purchaseId,
      customer_email: userEmail, // Pre-fill email for guest checkout
      metadata: {
        packageId: packageId,
        purchaseId: purchaseId,
        userEmail: userEmail,
        userName: userName,
        type: 'package'
      },
      payment_intent_data: {
        metadata: {
          packageId: packageId,
          purchaseId: purchaseId,
          userEmail: userEmail,
          type: 'package'
        }
      },
      custom_text: {
        submit: {
          message: `You'll receive ${lsatPackage.sessions} LSAT tutoring sessions valid for ${lsatPackage.duration}`
        }
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe package checkout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create checkout session',
      error: error.message
    });
  }
});

app.post('/create-checkout-lsat-session', async (req, res) => {
  try {
    const { sessionId, numberOfStudents, totalAmount } = req.body;

    // Fetch session details from your backend
    const { data } = await axios.get(`${process.env.BACKEND_URL}/api/v1/lsat-sessions/single/${sessionId}`);

    if (!data || !data.success) {
      return res.status(500).json({ success: false, message: 'Session not found' });
    }

    const lsatSession = data.data;
    const sessionType = lsatSession.sessionType;

    let lineItems = [];
    let successUrl = '';
    let description = '';

    if (sessionType === 'class') {
      // Class session with dynamic pricing
      const actualTotalAmount = totalAmount || lsatSession.price;
      const actualNumberOfStudents = numberOfStudents || lsatSession.numberOfStudents;

      lineItems = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `LSAT Group Class Session - ${actualNumberOfStudents} Students`,
              description: `Group LSAT tutoring session for ${actualNumberOfStudents} students - ${lsatSession.duration || '2 hours'}`
            },
            unit_amount: Math.round(Number(actualTotalAmount)) * 100,
          },
          quantity: 1,
        },
      ];

      successUrl = `${process.env.FRONTEND_URL}/checkout-lsat-session-success/${sessionId}`;
      description = `Group session for ${actualNumberOfStudents} students at $${actualTotalAmount}`;

    } else if (sessionType === 'one-on-one') {
      // 1-on-1 session using package
      lineItems = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `LSAT 1-on-1 Tutoring Session`,
              description: `Individual LSAT tutoring session - ${lsatSession.duration || '1 hour'}`
            },
            unit_amount: 0, // Free since it uses package sessions
          },
          quantity: 1,
        },
      ];

      successUrl = `${process.env.FRONTEND_URL}/checkout-lsat-session-success/${sessionId}`;
      description = '1-on-1 session using package credit';

    } else {
      // Free consultation session
      lineItems = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `LSAT Free Consultation Session`,
              description: `Free LSAT consultation - ${lsatSession.duration || '30 minutes'}`
            },
            unit_amount: 0, // Free session
          },
          quantity: 1,
        },
      ];

      successUrl = `${process.env.FRONTEND_URL}/checkout-lsat-session-success/${sessionId}`;
      description = 'Free consultation session';
    }

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: sessionType === 'free' || sessionType === 'one-on-one' ? 'payment' : 'payment',
      success_url: successUrl,
      cancel_url: `${process.env.FRONTEND_URL}/checkout-cancel`,
      client_reference_id: sessionId,
      customer_email: lsatSession.email, // Pre-fill customer email
      metadata: {
        sessionId: sessionId,
        sessionType: sessionType,
        numberOfStudents: numberOfStudents || lsatSession.numberOfStudents || 1,
        totalAmount: totalAmount || lsatSession.price || 0,
        userEmail: lsatSession.email,
        userName: lsatSession.fullName
      },
      payment_intent_data: sessionType === 'class' ? {
        metadata: {
          sessionId: sessionId,
          sessionType: sessionType,
          numberOfStudents: numberOfStudents || lsatSession.numberOfStudents || 1,
          type: 'lsat-session'
        }
      } : undefined,
      custom_text: {
        submit: {
          message: sessionType === 'class' ?
            `You're booking a group session for ${numberOfStudents || lsatSession.numberOfStudents} students` :
            sessionType === 'one-on-one' ?
              'You\'re using a package session for 1-on-1 tutoring' :
              'You\'re booking a free consultation session'
        }
      },
      // Allow promotion codes for paid sessions
      allow_promotion_codes: sessionType === 'class'
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe LSAT session checkout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create checkout session',
      error: error.message
    });
  }
});

app.post('/api/v1/emails/order', sendOrderEmail);
app.post('/api/v1/emails/accommodation', sendAccommodationEmail);
app.post('/api/v1/emails/contact', sendContactEmail);
app.post('/api/v1/emails/lsat-session', sendLsatSessionEmail);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));