import { model, Schema } from "mongoose";

const lsatPackagePurchaseSchema = new Schema({
    package: {
        type: Schema.Types.ObjectId,
        ref: 'LsatPackage',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false // For guest purchases
    },
    userEmail: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userPhone: {
        type: String,
        required: true
    },
    sessionsPurchased: {
        type: Number,
        required: true
    },
    sessionsRemaining: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stripePaymentIntentId: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'expired', 'cancelled'],
        default: 'active'
    },
    expiresAt: {
        type: Date,
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const LSATPackagePurchase = model('LSATPackagePurchase', lsatPackagePurchaseSchema);
export default LSATPackagePurchase;