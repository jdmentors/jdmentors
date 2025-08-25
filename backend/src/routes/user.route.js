import { Router } from "express";
import { deleteUser, forgotPassword, getAllUsers, getAUser, loginUser, logOutUser, refreshAccessToken, registerUser, resetPassword, updateUser } from "../controllers/user.controller.js";
import verifyUser from "../middlewares/verifyUser.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import upload from "../utils/multer.js";

const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password/:token', resetPassword);
userRouter.get('/logout', verifyUser, logOutUser);
userRouter.get('/refresh-access-token', refreshAccessToken);
userRouter.get('/all', verifyAdmin, getAllUsers);
userRouter.get('/single/:userId', getAUser);
userRouter.delete('/delete/:userId', verifyAdmin, deleteUser);
userRouter.patch('/update', verifyUser, upload.any(), updateUser);

export default userRouter;