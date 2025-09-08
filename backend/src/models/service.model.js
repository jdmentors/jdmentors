import { Schema, model } from "mongoose";

const serviceSchema = new Schema({
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
    features: {
        type: Array,
        trim:true
    },
    addons: {
        type: Array,
        trim:true
    },
    extras: {
        type: Array,
        trim:true
    },
    process: {
        type: String,
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

const Service = model('Service', serviceSchema);

export default Service;