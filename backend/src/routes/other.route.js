import { Router } from "express";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import { getAllOthers, updateAccommodationPrice } from "../controllers/other.controller.js";

const otherRouter = Router();

otherRouter.put('/update/accommodation-price', verifyAdmin, updateAccommodationPrice);
// otherRouter.post('/create/accommodation-price', verifyAdmin, createAccommodationPrice);
otherRouter.get('/all', getAllOthers);

export default otherRouter;