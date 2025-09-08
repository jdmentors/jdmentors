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
        refPath: 'serviceType',
        required: true
    },
    serviceType: {
        type: String,
        enum: ['Service', 'Package', 'Addon', 'Extra'],
        required: true,
        default: 'Service'
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
    },
    document: {
        type: [String],
        required: false
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
    emailSent: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Session = model('Session', sessionSchema);

export default Session;