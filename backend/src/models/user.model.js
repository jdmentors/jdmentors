import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
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
        default: 'user'
    },
    image: {
        type: String,
        trim: true
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
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

userSchema.methods.generateAccessToken = async function(){
    try {
        return await jwt.sign({id:this._id}, process.env.ACCESS_TOKEN_KEY, {expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
    } catch (error) {
        throw new Error(error);
    }
}

userSchema.methods.generateRefreshToken = async function(){
    try {
        return await jwt.sign({id:this._id}, process.env.REFRESH_TOKEN_KEY, {expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
    } catch (error) {
        throw new Error(error);
    }
}

const User = model('User', userSchema);

export default User;