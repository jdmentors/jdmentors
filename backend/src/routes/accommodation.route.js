import { Router } from "express";
import upload from "../utils/multer.js";
import verifyUser from "../middlewares/verifyUser.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import { createAccommodation, getAnAccommodation } from "../controllers/accommodation.controller.js";

const accommodationRouter = Router();

accommodationRouter.post('/create', upload.array('document'), createAccommodation);
// accommodationRouter.get('/user', verifyUser, getSessionsOfUser);
accommodationRouter.get('/single/:accommodationId', getAnAccommodation);
// accommodationRouter.get('/all', verifyAdmin, getAllSessions);
// accommodationRouter.delete('/delete/:blogId', verifyAdmin, deleteBlog);
// accommodationRouter.patch('/status/:sessionId', updateSessionStatus);

export default accommodationRouter;