import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { resetPasswordEmail } from "../utils/nodemailer.js";
import crypto from "crypto";

const registerUser = async (req, res) => {
    try {
        const { fullName, email, phone = '', image = '', password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const existingUser = await userExists(email);

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists.' });
        }

        const createdUser = await User.create({ fullName, email, phone, password, image });

        if (!createdUser) {
            return res.status(500).json({ success: false, message: 'Could not create user.' });
        }

        await loginUser(req, res);
    } catch (error) {
        throw new Error(error);
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password, userType='user' } = req.body;

        if (!email || !password || !userType) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        // const user = await userExists(email);

        const user = await User.findOne({email, userType});

        if (!user) {
            return res.status(404).json({ success: false, message: 'No user found with this email.' });
        }

        const matchPassword = await bcrypt.compare(password, user.password);

        if (!matchPassword) {
            return res.status(404).json({ success: false, message: 'Wrong password' });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user);

        return res.status(200).cookie('accessToken', accessToken, { httpOnly: true, secure: false, sameSite: 'lax' }).json({ success: true, message: 'Logged In', data: { user: { id: user._id, fullName: user.fullName, email, phone: user.phone || '', image: user.image || '', userType: user.userType }, accessToken, refreshToken } });
    } catch (error) {
        throw new Error(error);
    }
}

const logOutUser = async (req, res) => {
    try {
        const user = req.user;
        user.refreshToken = '';
        user.save({ validateBeforeSave: false });

        return res.status(200).clearCookie('accessToken').json({ success: true, message: 'Logged Out' });
    } catch (error) {
        throw new Error(error);
    }
}

const userExists = async (email) => {
    try {
        const user = await User.findOne({ email });

        if (user) {
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

const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.headers.authorization.split(' ')[1];

        const verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);

        if (verified) {
            const { id } = await jwt.decode(refreshToken);
            const user = await User.findById(id);

            if (user) {
                const accessToken = await user.generateAccessToken();

                return res.status(200).cookie('accessToken', accessToken, { httpOnly: true, secure: false, sameSite: 'lax' }).json({ success: true, data: { accessToken } })
            }
        }
    } catch (error) {
        return res.status(401).json({ success: false, message: 'refreshToken' })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.aggregate([
            {
                $lookup: {
                    from: 'sessions',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'sessions'
                }
            },
            {
                $unwind: {
                    path: '$sessions',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'services',
                    localField: 'sessions.service',
                    foreignField: '_id',
                    as: 'services'
                }
            },
            {
                $unwind: {
                    path: '$services',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$_id',
                    fullName: { $first: '$fullName' },
                    email: { $first: '$email' },
                    phone: { $first: '$phone' },
                    createdAt: { $first: '$createdAt' },
                    sessionCount: { $sum: { $cond: [{ $ifNull: ['$sessions', false] }, 1, 0] } },
                    totalSpent: { $sum: { $ifNull: ['$services.price', 0] } }
                }
            }
        ]);


        if (!allUsers) {
            return res.status(404).json({ success: false, message: 'No Users found' });
        }

        return res.status(200).json({ success: true, message: 'Users found', data: allUsers });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to get User' });
    }
}

const getAUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is needed' });
        }

        const user = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'sessions',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'sessions'
                }
            },
            { $unwind: '$sessions' },
            {
                $lookup: {
                    from: 'services',
                    localField: 'sessions.service',
                    foreignField: '_id',
                    as: 'service'
                }
            },
            { $unwind: '$service' },
            {
                $group: {
                    _id: '$_id',
                    fullName: { $first: '$fullName' },
                    email: { $first: '$email' },
                    phone: { $first: '$phone' },
                    createdAt: { $first: '$createdAt' },
                    sessions: { $push: '$sessions' },
                    services: { $push: '$service' },
                    sessionCount: { $sum: 1 },
                    totalSpent: { $sum: '$service.price' }
                }
            }
        ]);


        if (!user) {
            return res.status(404).json({ success: false, message: 'No user found' });
        }

        return res.status(200).json({ success: true, message: 'User found', data: user });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to get user' });
    }
}

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID needed to delete' });
        }

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(500).json({ success: false, message: 'No user found' });
        }

        return res.status(200).json({ success: true, message: 'User deleted' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Deletion failed' });
    }
}

const updateUser = async (req, res) => {
    try {
        const user = req.user;
        const { fullName, email, phone, image, password } = req.body;
        const uploadedImg = req.files[0];

        if (!fullName || !email || !phone || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        let image_url;

        if (uploadedImg) {
            image_url = await uploadOnCloudinary(uploadedImg?.buffer);
        }

        const refreshToken = user.refreshToken;

        user.fullName = fullName;
        user.email = email;
        user.phone = phone;
        user.password = password;
        user.image = image_url || image;

        await user.save({ validateBeforeSave: false });

        const accessToken = req?.headers?.authorization.split(' ')[1];

        res.status(200).json({ success: true, message: 'Profile updated', data: { user, accessToken, refreshToken } });
    } catch (error) {
        throw new Error(error.message);
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const user = await userExists(email);

        if (!user) {
            return res.status(200).json({ success: true, message: 'If an account with that email exists, a reset link has been sent.' });
        }

        const resetToken = await user.generateResetPasswordToken();
        await user.save({validateBeforeSave: false});

        const emailSent = await resetPasswordEmail(user.email, `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`);

        if(!emailSent){
            user.resetPasswordToken = null;
            user.resetPasswordTokenExpiry = null;
            await user.save({validateBeforeSave: false});
            return res.status(500).json({ success: false, message: 'Could not send email' });
        }

        return res.status(200).json({ success: true, message: 'If an account with that email exists, a reset link has been sent.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;

        const { newPassword } = req.body;

        if (!token) {
            return res.status(400).json({ success: false, message: 'Token is required' });
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({resetPasswordToken: hashedToken, resetPasswordTokenExpiry: {$gt: Date.now()}})

        if (!user) {
            return res.status(200).json({ success: true, message: 'Token is invalid or has expired' });
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({ success: true, message: 'Password updated' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to get user' });
    }
}

export {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    getAllUsers,
    getAUser,
    deleteUser,
    updateUser,
    userExists,
    forgotPassword,
    resetPassword,
}
