import { model, Schema } from "mongoose";

const sessionSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    addonsAndExtras: {
        type: Array,
        required: false,
    },
    dateTime: {
        type: Date,
        default: null
    },
    notes: {
        type: String,
        trim: true,
        default: null
    },
    document: {
        type: [String],
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    },
    payment: {
        type: Boolean,
        required: true,
        default: false
    },
}, { timestamps: true });

const Session = model('Session', sessionSchema);

export default Session;