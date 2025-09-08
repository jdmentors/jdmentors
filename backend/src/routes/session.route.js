import { Router } from "express";
import upload from "../utils/multer.js";
import { createSession, getAllSessions, getASession, getSessionsOfUser, updateSessionEmailStatus, updateSessionStatus } from "../controllers/session.controller.js";
import verifyUser from "../middlewares/verifyUser.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const sessionRouter = Router();

sessionRouter.post('/create', upload.array('document'), createSession);
sessionRouter.get('/user', verifyUser, getSessionsOfUser);
sessionRouter.get('/single/:sessionId', getASession);
sessionRouter.get('/all', verifyAdmin, getAllSessions);
sessionRouter.patch('/status/:sessionId', updateSessionStatus);
sessionRouter.patch('/email-status/:sessionId', updateSessionEmailStatus);

export default sessionRouter;