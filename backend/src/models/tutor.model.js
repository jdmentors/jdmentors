import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const tutorSchema = new Schema({
    fullName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
    },
    phone: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        trim: true,
        default: 'tutor'
    },
    image: {
        type: String,
        trim: true
    },
    classes: [{
        type: String,
        trim: true,
        required: true
    }],
    school: {
        type: String,
        trim: true,
        required: true
    },
    grades: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    refreshToken: {
        type: String,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordTokenExpiry: {
        type: String,
    }
}, { timestamps: true });

tutorSchema.pre('save', async function(next) {
    try {
        if (this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 10);
        }
        next();
    } catch (error) {
        next(error);
        throw new Error(error);
    }
});

tutorSchema.methods.generateAccessToken = async function(){
    try {
        return await jwt.sign({id:this._id}, process.env.ACCESS_TOKEN_KEY, {expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
    } catch (error) {
        throw new Error(error);
    }
}

tutorSchema.methods.generateRefreshToken = async function(){
    try {
        return await jwt.sign({id:this._id}, process.env.REFRESH_TOKEN_KEY, {expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
    } catch (error) {
        throw new Error(error);
    }
}

tutorSchema.methods.generateResetPasswordToken = async function(){
    try {
        const resetToken = crypto.randomBytes(32).toString('hex');

        this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        this.resetPasswordTokenExpiry = Date.now() + 60*60*1000;

        return resetToken;
    } catch (error) {
        throw new Error(error);
    }
}

const Tutor = model('Tutor', tutorSchema);

export default Tutor;