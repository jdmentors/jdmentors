import { model, Schema } from 'mongoose';

const couponSchema = new Schema({ 
    coupon: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    usage: {
        type: Number,
        required: false,
        default: null
    },
    redeemed: {
        type: Number,
        required: true,
        default: 0
    },
    expiration: {
        type: Date,
        required: false,
        default: null
    },
    discount: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }
}, {timestamps: true});

const Coupon = model('Coupon', couponSchema);

export default Coupon;