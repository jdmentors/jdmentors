import { Schema, model } from "mongoose";

const extraSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
        trim: true,
        default: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps:true});

const Extra = model('Extra', extraSchema);

export default Extra;