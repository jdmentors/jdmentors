import { Router } from "express";
import { loginUser, logOutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import verifyUser from "../middlewares/verifyUser.js";

const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/logout', verifyUser, logOutUser);
userRouter.get('/refresh-access-token', refreshAccessToken);

export default userRouter;