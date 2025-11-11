import { Router } from "express";
import upload from "../utils/multer.js";
import verifyUser from "../middlewares/verifyUser.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import verifyTutor from "../middlewares/verifyTutor.js";
import { 
    createLsatSession, 
    getLsatSessionsOfUser, 
    getAllLsatSessions, 
    getLsatSession, 
    updateLsatSessionStatus, 
    updateLsatSessionEmailStatus,
    markSessionAsCompleted, 
    getLsatSessionsOfTutor
} from "../controllers/lsatsession.controller.js";

const lsatSessionRouter = Router();

lsatSessionRouter.post('/create', upload.array('document'), createLsatSession);
lsatSessionRouter.get('/user', verifyUser, getLsatSessionsOfUser);
lsatSessionRouter.get('/single/:sessionId', getLsatSession);
lsatSessionRouter.get('/all', verifyAdmin, getAllLsatSessions);
lsatSessionRouter.patch('/status/:sessionId', verifyAdmin, updateLsatSessionStatus);
lsatSessionRouter.patch('/email-status/:sessionId', updateLsatSessionEmailStatus);
lsatSessionRouter.patch('/complete/:sessionId', verifyAdmin, markSessionAsCompleted);
lsatSessionRouter.get('/tutor', verifyTutor, getLsatSessionsOfTutor);

export default lsatSessionRouter;