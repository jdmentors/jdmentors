import { model, Schema } from "mongoose";

const accommodationSchema = new Schema({
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
    preferredContact: {
        type: Array,
        required: false
    },
    otherContactMethod: {
        type: String,
        required: false
    },
    exam: {
        type: Array,
        required: false
    },
    seekingAccommodations: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true,
    },
    dateTime: {
        type: Date,
        default: null
    },
    supportingDocumentation: {
        type: String,
        required: false,
    },
    previousAccommodation: {
        type: String,
        default: null
    },
    providedAccommodations: {
        type: String,
        default: null
    },
    additionalInfomation: {
        type: String,
        trim: true,
        default: null,
        required: false
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

const Accommodation = model('Accommodation', accommodationSchema);

export default Accommodation;