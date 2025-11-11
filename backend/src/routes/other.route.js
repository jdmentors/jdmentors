import { Router } from "express";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import { getAllOthers, getAllPricing, getPricingByPeople, initializeDefaultPricing, updateAccommodationPrice, updatePricing } from "../controllers/other.controller.js";

const otherRouter = Router();

otherRouter.put('/update/accommodation-price', verifyAdmin, updateAccommodationPrice);
// otherRouter.post('/create/accommodation-price', verifyAdmin, createAccommodationPrice);
otherRouter.get('/all', getAllOthers);
otherRouter.get('/pricing', getAllPricing);
otherRouter.get('/pricing/:people', getPricingByPeople);
otherRouter.put('/pricing', updatePricing);
otherRouter.post('/pricing/initialize', initializeDefaultPricing);

export default otherRouter;