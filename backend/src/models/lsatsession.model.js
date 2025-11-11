import { model, Schema } from "mongoose";

const lsatSessionSchema = new Schema({
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
    sessionType: {
        type: String,
        required: true,
        enum: ['free', 'one-on-one', 'class'],
        default: 'free'
    },
    tutor: {
        type: Schema.Types.ObjectId,
        ref: 'Tutor',
        required: true
    },
    packageId: {
        type: Schema.Types.ObjectId,
        ref: 'LsatPackage',
        required: false
    },
    packagePurchaseId: {
        type: Schema.Types.ObjectId,
        ref: 'LSATPackagePurchase',
        required: false
    },
    currentScore: {
        type: String,
        required: false,
        trim: true
    },
    targetScore: {
        type: String,
        required: true,
        trim: true
    },
    weakAreas: {
        type: String,
        required: true,
        trim: true
    },
    studyMaterials: {
        type: String,
        required: false,
        trim: true
    },
    previousTutoring: {
        type: String,
        required: true,
        enum: ['Yes', 'No']
    },
    specificGoals: {
        type: String,
        required: true,
        trim: true
    },
    dateTime: {
        type: Date,
        required: true
    },
    notes: {
        type: String,
        required: false,
        trim: true
    },
    numberOfStudents: {
        type: Number,
        required: false,
        min: 1,
        max: 5,
        default: 1
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    pricePerPerson: {
        type: Number,
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
    },
    sessionCompleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const LsatSession = model('LsatSession', lsatSessionSchema);

export default LsatSession;