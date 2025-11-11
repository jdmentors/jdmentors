import { Router } from "express";
import { 
    deleteTutor, 
    forgotPassword, 
    getAllTutors, 
    getATutor, 
    loginTutor, 
    logOutTutor, 
    refreshAccessToken, 
    registerTutor, 
    resetPassword, 
    updateTutor,
    verifyTutor,
    toggleTutorStatus,
    updateTutorByAdmin
} from "../controllers/tutor.controller.js";
import verifyTutorMiddleware from "../middlewares/verifyTutor.js"; // Renamed import
import verifyAdmin from "../middlewares/verifyAdmin.js";
import upload from "../utils/multer.js";

const tutorRouter = Router();

tutorRouter.post('/register', upload.any(), registerTutor);
tutorRouter.post('/login', loginTutor);
tutorRouter.post('/forgot-password', forgotPassword);
tutorRouter.post('/reset-password/:token', resetPassword);
tutorRouter.get('/logout', verifyTutorMiddleware, logOutTutor); // Use renamed import
tutorRouter.get('/refresh-access-token', refreshAccessToken);
tutorRouter.get('/all', getAllTutors);
tutorRouter.get('/single/:tutorId', getATutor);
tutorRouter.delete('/delete/:tutorId', verifyAdmin, deleteTutor);
tutorRouter.patch('/update', verifyTutorMiddleware, upload.any(), updateTutor); // Use renamed import
tutorRouter.patch('/verify/:tutorId', verifyAdmin, verifyTutor);
tutorRouter.patch('/toggle-status/:tutorId', verifyAdmin, toggleTutorStatus);
tutorRouter.patch('/update/:tutorId', verifyAdmin, upload.any(), updateTutorByAdmin);

export default tutorRouter;