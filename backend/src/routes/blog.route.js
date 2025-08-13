import { Router } from "express";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import { createBlog, deleteBlog, editBlog, getABlog, getAllBlogs, updateAvailability } from "../controllers/blog.controller.js";
import upload from "../utils/multer.js";

const blogRouter = Router();

const allowedOrigins = ['https://www.jdmentors.com', 'http://localhost:5173'];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
};

blogRouter.options('/edit/:blogId', cors(corsOptions));
blogRouter.post('/create', verifyAdmin, upload.single('image'), createBlog);
blogRouter.put('/edit/:blogId', verifyAdmin, upload.any(), editBlog);
blogRouter.get('/single/:slug', getABlog);
blogRouter.get('/all', getAllBlogs);
blogRouter.delete('/delete/:blogId', verifyAdmin, deleteBlog);
blogRouter.patch('/availability/:blogId', verifyAdmin, updateAvailability);

export default blogRouter;
