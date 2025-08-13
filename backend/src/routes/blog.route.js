import { Router } from "express";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import { createBlog, deleteBlog, editBlog, getABlog, getAllBlogs, updateAvailability } from "../controllers/blog.controller.js";
import upload from "../utils/multer.js";

const blogRouter = Router();

blogRouter.post('/create', verifyAdmin, upload.single('image'), createBlog);
blogRouter.put('/edit/:blogId',  editBlog);
blogRouter.get('/single/:slug', getABlog);
blogRouter.get('/all', getAllBlogs);
blogRouter.delete('/delete/:blogId', verifyAdmin, deleteBlog);
blogRouter.patch('/availability/:blogId', verifyAdmin, updateAvailability);

export default blogRouter;
