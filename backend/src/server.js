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

const app = express();
dbConnect();
configureCloudinary();

const stripe = Stripe(`${process.env.STRIPE_SECRET_KEY}`);
const PORT = process.env.PORT || 3000;
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ limit: '16kb' }));
app.use(cors({
  origin: (origin, callback) => {
    callback(null, origin || true);
  },
  credentials: true,
}));

app.get('/', (req, res) => res.send('Welcome Back!!'));
app.use('/api/v1/users', userRouter);
app.use('/api/v1/services', serviceRouter);
app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/sessions', sessionRouter);
app.get('/api/v1/dashboard', verifyAdmin, dashboard);
app.post('/api/v1/admin/register', verifyAdmin, createAdmin);

app.post('/create-checkout-session', async (req, res) => {
    const { sessionId } = req.body;

    const { data } = await axios.get(`${process.env.BACKEND_URL}/api/v1/sessions/single/${sessionId}`);

    if(!data){
        res.status(500).json({success: false, message: 'Session not found'});
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
    });

    res.json({url: session.url});
});

app.post('/api/v1/emails/order', sendOrderEmail);
app.post('/api/v1/emails/contact', sendContactEmail);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));