import { Router } from "express";
import upload from "../utils/multer.js";
import verifyUser from "../middlewares/verifyUser.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import { createAccommodation, getAccommodationsOfUser, getAllAccommodations, getAnAccommodation, updateAccommodationEmailStatus, updateAccommodationStatus } from "../controllers/accommodation.controller.js";

const accommodationRouter = Router();

accommodationRouter.post('/create', upload.array('document'), createAccommodation);
accommodationRouter.get('/user', verifyUser, getAccommodationsOfUser);
accommodationRouter.get('/single/:accommodationId', getAnAccommodation);
accommodationRouter.get('/all', verifyAdmin, getAllAccommodations);
accommodationRouter.patch('/status/:accommodationId', updateAccommodationStatus);
accommodationRouter.patch('/email-status/:accommodationId', updateAccommodationEmailStatus);

export default accommodationRouter;