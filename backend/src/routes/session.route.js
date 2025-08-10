import { Router } from "express";
import upload from "../utils/multer.js";
import { createSession, getAllSessions, getSessionsOfUser, updateSessionStatus } from "../controllers/session.controller.js";
import verifyUser from "../middlewares/verifyUser.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const sessionRouter = Router();

sessionRouter.post('/create', verifyUser, upload.single('document'), createSession);
sessionRouter.get('/user', verifyUser, getSessionsOfUser);
// sessionRouter.get('/single/:slug', getABlog);
sessionRouter.get('/all', verifyAdmin, getAllSessions);
// sessionRouter.delete('/delete/:blogId', verifyAdmin, deleteBlog);
sessionRouter.patch('/status/:sessionId', updateSessionStatus);

export default sessionRouter;