import { Schema, model } from "mongoose";

const addonSchema = new Schema({
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
    order: {
        type: Number,
        required: false,
        default: null,
        index: true
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
    },
    isDocumentRequired: {
        type: Boolean,
        default: false
    }
}, {timestamps:true});

const Addon = model('Addon', addonSchema);

export default Addon;