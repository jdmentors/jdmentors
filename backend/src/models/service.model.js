import { Schema, model } from "mongoose";

const serviceSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
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
    features: {
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
    status: {
        type: String,
        required: true,
        trim: true,
        default: "active"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps:true});

const Service = model('Service', serviceSchema);

export default Service;