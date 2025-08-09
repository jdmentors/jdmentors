import { Router } from "express";
import upload from "../utils/multer.js";
import { createSession } from "../controllers/session.controller.js";
import verifyUser from "../middlewares/verifyUser.js";

const sessionRouter = Router();

sessionRouter.post('/create', verifyUser, upload.single('document'), createSession);
// sessionRouter.put('/edit/:blogId', verifyAdmin, upload.any(), editBlog);
// sessionRouter.get('/single/:slug', getABlog);
// sessionRouter.get('/all', getAllBlogs);
// sessionRouter.delete('/delete/:blogId', verifyAdmin, deleteBlog);
// sessionRouter.patch('/availability/:blogId', verifyAdmin, updateAvailability);

export default sessionRouter;