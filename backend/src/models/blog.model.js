import { Schema, model } from "mongoose";

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    slug: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        trim:true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps:true});

const Blog = model('Blog', blogSchema);

export default Blog;