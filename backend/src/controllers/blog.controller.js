import Blog from "../models/blog.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createBlog = async (req, res) => {
    try {
        const { title, slug, content, description, status } = req.body;

        const user = req.user;

        const image = req.file;

        if (!title || !slug || !content || !description || !status) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        if (!image) {
            return res.status(400).json({ success: false, message: 'Image not found.' });
        }

        const blogExists = await Blog.findOne({ title });

        if (blogExists) {
            return res.status(400).json({ success: false, message: 'Blog already exists with this title' });
        }

        const uploaded = await uploadOnCloudinary(image.path);

        if(!uploaded){
            throw new Error('Could not upload on cloudinary.');
        }

        const blog = await Blog.create({ title, slug, description, content, image: uploaded, status, user: user._id });

        if (!blog) {
            return res.status(500).json({ success: false, message: 'Error occured while creating blog' });
        }

        return res.status(200).json({ success: true, message: 'Blog created' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const getAllBlogs = async (req, res) => {
    try {
        const allBlogs = await Blog.find().populate({
            path: "user",
            select: "fullName image"
        });

        if (!allBlogs) {
            return res.status(404).json({ success: false, message: 'No Blogs found' });
        }

        return res.status(200).json({ success: true, message: 'Blogs found', data: allBlogs });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to get blog' });
    }
}

const getABlog = async (req, res) => {
    try {
        const { slug } = req.params;

        if (!slug) {
            return res.status(400).json({ success: false, message: 'Slug is needed' });
        }

        const blog = await Blog.findOne({slug}).populate({
            path: "user",
            select: "fullName image"
        });

        if (!blog) {
            return res.status(404).json({ success: false, message: 'No blog found' });
        }

        return res.status(200).json({ success: true, message: 'Blog found', data: blog });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to get blog' });
    }
}

const updateAvailability = async (req, res) => {
    try {
        const { status } = req.body;

        const { blogId } = req.params;

        if (!blogId) {
            return res.status(400).json({ success: false, message: 'Blog ID is required.' });
        }

        const blog = await Blog.findByIdAndUpdate(blogId, {status:status}, {new: true});

        if (!blog) {
            return res.status(500).json({ success: false, message: 'Error occured while updating blog' });
        }

        return res.status(200).json({ success: true, message: 'Blog updated', data: blog });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'blog updation failed' });
    }
}

const editBlog = async (req, res) => {
    try {
        const { title, slug, description, content, image, status } = req.body;

        const { blogId } = req.params;
        const uploadedImg = req.files[0];

        let uploaded;

        if(uploadedImg){
            uploaded = await uploadOnCloudinary(uploadedImg.path);
        }

        if (!title || !slug || !description || !content) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const blog = await Blog.findByIdAndUpdate(blogId, {title, slug, description, content, image: uploaded || image, status});

        if (!blog) {
            return res.status(500).json({ success: false, message: 'Error occured while updating blog' });
        }

        return res.status(200).json({ success: true, message: 'Blog updated' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const deleteBlog = async (req, res) => {
    try {
        const { blogId } = req.params;

        if (!blogId) {
            return res.status(400).json({ success: false, message: 'Blog ID needed to delete' });
        }

        const blog = await Blog.findByIdAndDelete(blogId);

        if (!blog) {
            return res.status(500).json({ success: false, message: 'No blog found' });
        }

        return res.status(200).json({ success: true, message: 'blog deleted' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Deletion failed' });
    }
}

export {
    createBlog,
    getAllBlogs,
    getABlog,
    updateAvailability,
    editBlog,
    deleteBlog,
}