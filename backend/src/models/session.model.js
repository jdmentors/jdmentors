import { model, Schema } from "mongoose";

const sessionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    dateTime: {
        type: Date,
    },
    document: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    }
}, {timestamps: true});

const Session = model('Session', sessionSchema);

export default Session;