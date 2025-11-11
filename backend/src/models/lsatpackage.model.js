import { model, Schema } from "mongoose";

const lsatPackageSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    sessions: {
        type: Number,
        required: true,
        enum: [1, 5, 10]
    },
    price: {
        type: Number,
        required: true
    },
    originalPrice: {
        type: Number
    },
    discount: {
        type: Number,
        default: 0
    },
    features: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    duration: {
        type: String, // e.g., "3 months", "6 months"
        default: "6 months"
    }
}, { timestamps: true });

const LsatPackage = model('LsatPackage', lsatPackageSchema);
export default LsatPackage;