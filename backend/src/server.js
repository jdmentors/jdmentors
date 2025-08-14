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
import { createAdmin, dashboard, sendContactEmail, sendOrderEmail } from "./controllers/other.controller.js";
import Stripe from "stripe";
import axios from "axios";
import compression from "compression";
import Session from "./models/session.model.js";
import bodyParser from 'body-parser';

const app = express();
app.use(compression());
dbConnect();
configureCloudinary();

const stripe = Stripe(`${process.env.STRIPE_SECRET_KEY}`);
const PORT = process.env.PORT || 3000;

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

      try {
        await Session.findByIdAndUpdate(sessionId, { payment: true }, { new: true });
        console.log("Payment updated for session:", sessionId);
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
app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/sessions', sessionRouter);
app.get('/api/v1/dashboard', verifyAdmin, dashboard);
app.post('/api/v1/admin/register', verifyAdmin, createAdmin);

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
          unit_amount: Number(data.data.service.price) * 100,
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

app.post('/api/v1/emails/order', sendOrderEmail);
app.post('/api/v1/emails/contact', sendContactEmail);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
