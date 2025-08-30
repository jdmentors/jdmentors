import { Schema, model } from "mongoose";

const packageSchema = new Schema({
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
    services: {
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
    }
}, {timestamps:true});

const Package = model('Package', packageSchema);

export default Package;