import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const registerUser = async (req, res) => {
    try {
        const { fullName, email, phone='', password } = req.body;

        if(!fullName || !email || !password){
            return res.status(400).json({success:false, message:'All fields are required.'});
        }

        const existingUser = await userExists(email);

        if(existingUser){
            return res.status(400).json({success:false, message:'Email already exists.'});
        }

        const createdUser = await User.create({fullName, email, phone, password});

        if(!createdUser){
            return res.status(500).json({success:false, message:'Could not create user.'});
        }

        await loginUser(req, res);
    } catch (error) {
        throw new Error(error);
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({success:false, message:'All fields are required.'});
        }

        const user = await userExists(email);

        if(!user){
            return res.status(404).json({success:false, message:'No user found with this email.'});
        }

        const matchPassword = await bcrypt.compare(password, user.password);

        if(!matchPassword){
            return res.status(404).json({success:false, message:'No user found with this email.'});
        }

        const { accessToken } = await generateAccessAndRefreshToken(user);

        return res.status(200).cookie('accessToken', accessToken, { httpOnly: true, secure:false, sameSite: 'lax', maxAge: 15 * 60 * 1000 }).json({success:true, message:'Logged In', data:{user:{id:user._id, fullName:user.fullName, email, phone:user.phone || '', userType:user.userType}, accessToken}});
    } catch (error) {
        throw new Error(error);
    }
}

const logOutUser = async (req, res) => {
    try {
        const user = req.user;
        user.refreshToken = '';
        user.save({validateBeforeSave:false});

        return res.status(200).clearCookie('accessToken').json({success:true, message:'Logged Out'});
    } catch (error) {
        throw new Error(error);
    }
}

const userExists = async (email) => {
    try {
        const user = await User.findOne({email});

        if(user){
            return user;
        }
    } catch (error) {
        throw new Error(error);
    }
}

const generateAccessAndRefreshToken = async (user) => {
    try {
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save();

        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error(error);
    }
}

export {
    registerUser,
    loginUser,
    logOutUser,
}