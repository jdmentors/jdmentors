// routes/google.route.js
import { Router } from "express";
import { getGoogleReviews } from "../controllers/google.controller.js";

const googleRouter = Router();

// Public route to get Google reviews
googleRouter.get('/reviews', getGoogleReviews);

export default googleRouter;