import Tutor from "../models/tutor.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { resetPasswordEmail } from "../utils/nodemailer.js";
import crypto from "crypto";

// const registerTutor = async (req, res) => {
//     try {
//         const { fullName, email, phone = '', classes, school, grades, description, password } = req.body;

//         if (!fullName || !email || !password || !classes || !school || !grades || !description) {
//             return res.status(400).json({ success: false, message: 'All fields are required.' });
//         }

//         const existingTutor = await tutorExists(email);

//         if (existingTutor) {
//             return res.status(400).json({ success: false, message: 'Email already exists.' });
//         }

//         let image_url = '';
//         if (req.files && req.files.length > 0) {
//             image_url = await uploadOnCloudinary(req.files[0]?.buffer);
//         }

//         const createdTutor = await Tutor.create({ 
//             fullName, 
//             email, 
//             phone, 
//             password, 
//             image: image_url,
//             classes,
//             school,
//             grades,
//             description
//         });

//         if (!createdTutor) {
//             return res.status(500).json({ success: false, message: 'Could not create tutor account.' });
//         }

//         await loginTutor(req, res);
//     } catch (error) {
//         return res.status(500).json({ success: false, message: error.message });
//     }
// }

const registerTutor = async (req, res) => {
    try {
        const { fullName, email, phone = '', classes, school, grades, description, password } = req.body;

        if (!fullName || !email || !password || !classes || !school || !grades || !description) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        // Process classes string into array (trim and remove empty values)
        const classesArray = classes.split(',')
            .map(cls => cls.trim())
            .filter(cls => cls.length > 0);

        if (classesArray.length === 0) {
            return res.status(400).json({ success: false, message: 'Please enter at least one class.' });
        }

        const existingTutor = await tutorExists(email);

        if (existingTutor) {
            return res.status(400).json({ success: false, message: 'Email already exists.' });
        }

        let image_url = '';
        if (req.files && req.files.length > 0) {
            image_url = await uploadOnCloudinary(req.files[0]?.buffer);
        }

        const createdTutor = await Tutor.create({ 
            fullName, 
            email, 
            phone, 
            password, 
            image: image_url,
            classes: classesArray, // Store as array
            school,
            grades,
            description
        });

        if (!createdTutor) {
            return res.status(500).json({ success: false, message: 'Could not create tutor account.' });
        }

        await loginTutor(req, res);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const loginTutor = async (req, res) => {
    try {
        const { email, password, userType = 'tutor' } = req.body;

        if (!email || !password || !userType) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const tutor = await Tutor.findOne({ email, userType });

        if (!tutor) {
            return res.status(404).json({ success: false, message: 'No tutor found with this email.' });
        }

        if (!tutor.isActive) {
            return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact support.' });
        }

        const matchPassword = await bcrypt.compare(password, tutor.password);

        if (!matchPassword) {
            return res.status(401).json({ success: false, message: 'Wrong password' });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(tutor);

        // Set cookie options
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        };

        return res.status(200)
            .cookie('accessToken', accessToken, cookieOptions)
            .json({ 
                success: true, 
                message: 'Logged In Successfully', 
                data: { 
                    tutor: { 
                        id: tutor._id, 
                        fullName: tutor.fullName, 
                        email, 
                        phone: tutor.phone || '', 
                        image: tutor.image || '',
                        classes: tutor.classes,
                        school: tutor.school,
                        grades: tutor.grades,
                        description: tutor.description,
                        isVerified: tutor.isVerified,
                        isActive: tutor.isActive,
                        userType: tutor.userType 
                    }, 
                    accessToken, 
                    refreshToken 
                } 
            });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const logOutTutor = async (req, res) => {
    try {
        const tutor = req.tutor;
        tutor.refreshToken = '';
        tutor.save({ validateBeforeSave: false });

        return res.status(200).clearCookie('accessToken').json({ success: true, message: 'Logged Out' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const tutorExists = async (email) => {
    try {
        const tutor = await Tutor.findOne({ email });
        return tutor;
    } catch (error) {
        throw new Error(error);
    }
}

const generateAccessAndRefreshToken = async (tutor) => {
    try {
        const accessToken = await tutor.generateAccessToken();
        const refreshToken = await tutor.generateRefreshToken();

        tutor.refreshToken = refreshToken;

        await tutor.save();

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
            const tutor = await Tutor.findById(id);

            if (tutor) {
                const accessToken = await tutor.generateAccessToken();

                return res.status(200).cookie('accessToken', accessToken, { httpOnly: true, secure: false, sameSite: 'lax' }).json({ success: true, data: { accessToken } })
            }
        }
    } catch (error) {
        return res.status(401).json({ success: false, message: 'refreshToken' })
    }
}

const getAllTutors = async (req, res) => {
    try {
        const allTutors = await Tutor.find({}).select('-password -refreshToken');

        if (!allTutors || allTutors.length === 0) {
            return res.status(404).json({ success: false, message: 'No Tutors found' });
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Tutors found', 
            data: allTutors 
        });
    } catch (error) {
        console.error('Error in getAllTutors:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to get Tutors',
            error: error.message 
        });
    }
}

const getATutor = async (req, res) => {
    try {
        const { tutorId } = req.params;

        if (!tutorId) {
            return res.status(400).json({ success: false, message: 'Tutor ID is needed' });
        }

        const tutor = await Tutor.findById(tutorId).select('-password -refreshToken');

        if (!tutor) {
            return res.status(404).json({ success: false, message: 'No tutor found' });
        }

        return res.status(200).json({ success: true, message: 'Tutor found', data: tutor });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to get tutor' });
    }
}

const deleteTutor = async (req, res) => {
    try {
        const { tutorId } = req.params;

        if (!tutorId) {
            return res.status(400).json({ success: false, message: 'Tutor ID needed to delete' });
        }

        const tutor = await Tutor.findByIdAndDelete(tutorId);

        if (!tutor) {
            return res.status(500).json({ success: false, message: 'No tutor found' });
        }

        return res.status(200).json({ success: true, message: 'Tutor deleted' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Deletion failed' });
    }
}

// const updateTutor = async (req, res) => {
//     try {
//         const tutor = req.tutor;
//         const { fullName, email, phone, classes, school, grades, description, password } = req.body;
        
//         if (!fullName || !email || !phone || !classes || !school || !grades || !description) {
//             return res.status(400).json({ success: false, message: 'All fields are required.' });
//         }

//         let image_url = tutor.image;

//         if (req.files && req.files.length > 0) {
//             image_url = await uploadOnCloudinary(req.files[0]?.buffer);
//         }

//         tutor.fullName = fullName;
//         tutor.email = email;
//         tutor.phone = phone;
//         tutor.classes = classes;
//         tutor.school = school;
//         tutor.grades = grades;
//         tutor.description = description;
//         tutor.image = image_url;

//         if (password) {
//             tutor.password = password;
//         }

//         await tutor.save({ validateBeforeSave: false });

//         const accessToken = req?.headers?.authorization.split(' ')[1];
//         const refreshToken = tutor.refreshToken;

//         res.status(200).json({ 
//             success: true, 
//             message: 'Profile updated', 
//             data: { 
//                 tutor: {
//                     id: tutor._id,
//                     fullName: tutor.fullName,
//                     email: tutor.email,
//                     phone: tutor.phone,
//                     image: tutor.image,
//                     classes: tutor.classes,
//                     school: tutor.school,
//                     grades: tutor.grades,
//                     description: tutor.description,
//                     isVerified: tutor.isVerified,
//                     isActive: tutor.isActive,
//                     userType: tutor.userType
//                 }, 
//                 accessToken, 
//                 refreshToken 
//             } 
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, message: error.message });
//     }
// }

const updateTutor = async (req, res) => {
    try {
        const tutor = req.tutor;
        const { fullName, email, phone, classes, school, grades, description, password } = req.body;
        
        if (!fullName || !email || !phone || !classes || !school || !grades || !description) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        // Process classes string into array
        const classesArray = classes.split(',')
            .map(cls => cls.trim())
            .filter(cls => cls.length > 0);

        if (classesArray.length === 0) {
            return res.status(400).json({ success: false, message: 'Please enter at least one class.' });
        }

        let image_url = tutor.image;

        if (req.files && req.files.length > 0) {
            image_url = await uploadOnCloudinary(req.files[0]?.buffer);
        }

        tutor.fullName = fullName;
        tutor.email = email;
        tutor.phone = phone;
        tutor.classes = classesArray; // Store as array
        tutor.school = school;
        tutor.grades = grades;
        tutor.description = description;
        tutor.image = image_url;

        if (password) {
            tutor.password = password;
        }

        await tutor.save({ validateBeforeSave: false });

        const accessToken = req?.headers?.authorization.split(' ')[1];
        const refreshToken = tutor.refreshToken;

        res.status(200).json({ 
            success: true, 
            message: 'Profile updated', 
            data: { 
                tutor: {
                    id: tutor._id,
                    fullName: tutor.fullName,
                    email: tutor.email,
                    phone: tutor.phone,
                    image: tutor.image,
                    classes: tutor.classes, // Return as array
                    school: tutor.school,
                    grades: tutor.grades,
                    description: tutor.description,
                    isVerified: tutor.isVerified,
                    isActive: tutor.isActive,
                    userType: tutor.userType
                }, 
                accessToken, 
                refreshToken 
            } 
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const verifyTutor = async (req, res) => {
    try {
        const { tutorId } = req.params;

        if (!tutorId) {
            return res.status(400).json({ success: false, message: 'Tutor ID is required' });
        }

        const tutor = await Tutor.findByIdAndUpdate(
            tutorId, 
            { isVerified: true }, 
            { new: true }
        ).select('-password -refreshToken');

        if (!tutor) {
            return res.status(404).json({ success: false, message: 'Tutor not found' });
        }

        return res.status(200).json({ success: true, message: 'Tutor verified successfully', data: tutor });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const toggleTutorStatus = async (req, res) => {
    try {
        const { tutorId } = req.params;

        if (!tutorId) {
            return res.status(400).json({ success: false, message: 'Tutor ID is required' });
        }

        const tutor = await Tutor.findById(tutorId).select('-password -refreshToken');

        if (!tutor) {
            return res.status(404).json({ success: false, message: 'Tutor not found' });
        }

        tutor.isActive = !tutor.isActive;
        await tutor.save();

        return res.status(200).json({ 
            success: true, 
            message: `Tutor ${tutor.isActive ? 'activated' : 'deactivated'} successfully`, 
            data: tutor 
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const tutor = await tutorExists(email);

        if (!tutor) {
            return res.status(200).json({ success: true, message: 'If an account with that email exists, a reset link has been sent.' });
        }

        const resetToken = await tutor.generateResetPasswordToken();
        await tutor.save({validateBeforeSave: false});

        const emailSent = await resetPasswordEmail(tutor.email, `${process.env.FRONTEND_URL}/tutor-reset-password?token=${resetToken}`);

        if(!emailSent){
            tutor.resetPasswordToken = null;
            tutor.resetPasswordTokenExpiry = null;
            await tutor.save({validateBeforeSave: false});
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

        const tutor = await Tutor.findOne({
            resetPasswordToken: hashedToken, 
            resetPasswordTokenExpiry: {$gt: Date.now()}
        })

        if (!tutor) {
            return res.status(200).json({ success: true, message: 'Token is invalid or has expired' });
        }

        tutor.password = newPassword;
        tutor.resetPasswordToken = null;
        tutor.resetPasswordTokenExpiry = null;
        await tutor.save();

        return res.status(200).json({ success: true, message: 'Password updated' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to reset password' });
    }
}

// In tutor.controller.js
const updateTutorByAdmin = async (req, res) => {
    try {
        const { tutorId } = req.params;
        const { fullName, email, phone, classes, school, grades, description, isVerified, isActive } = req.body;

        if (!fullName || !email || !phone || !school || !grades || !description) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const tutor = await Tutor.findById(tutorId);
        
        if (!tutor) {
            return res.status(404).json({ success: false, message: 'Tutor not found' });
        }

        // Process classes if provided as string
        let classesArray = tutor.classes;
        if (classes) {
            if (typeof classes === 'string') {
                try {
                    // Try to parse as JSON first (if sent as stringified array)
                    classesArray = JSON.parse(classes);
                } catch {
                    // If not JSON, treat as comma-separated string
                    classesArray = classes.split(',')
                        .map(cls => cls.trim())
                        .filter(cls => cls.length > 0);
                }
            } else if (Array.isArray(classes)) {
                classesArray = classes;
            }
        }

        let image_url = tutor.image;
        if (req.files && req.files.length > 0) {
            image_url = await uploadOnCloudinary(req.files[0]?.buffer);
        }

        // Update tutor fields
        tutor.fullName = fullName;
        tutor.email = email;
        tutor.phone = phone;
        tutor.classes = classesArray;
        tutor.school = school;
        tutor.grades = grades;
        tutor.description = description;
        tutor.image = image_url;
        
        // Admin-only fields
        if (typeof isVerified !== 'undefined') {
            tutor.isVerified = isVerified;
        }
        if (typeof isActive !== 'undefined') {
            tutor.isActive = isActive;
        }

        await tutor.save({ validateBeforeSave: false });

        return res.status(200).json({ 
            success: true, 
            message: 'Tutor updated successfully', 
            data: { 
                tutor: {
                    id: tutor._id,
                    fullName: tutor.fullName,
                    email: tutor.email,
                    phone: tutor.phone,
                    image: tutor.image,
                    classes: tutor.classes,
                    school: tutor.school,
                    grades: tutor.grades,
                    description: tutor.description,
                    isVerified: tutor.isVerified,
                    isActive: tutor.isActive,
                    userType: tutor.userType
                }
            } 
        });
    } catch (error) {
        console.error('Admin update tutor error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export {
    registerTutor,
    loginTutor,
    logOutTutor,
    refreshAccessToken,
    getAllTutors,
    getATutor,
    deleteTutor,
    updateTutor,
    tutorExists,
    verifyTutor,
    toggleTutorStatus,
    forgotPassword,
    resetPassword,
    updateTutorByAdmin,
}