import LSATPackagePurchase from "../models/lsatpackagepurchase.model.js";
import LsatSession from "../models/lsatsession.model.js";
import { uploadDocsOnCloudinary } from "../utils/cloudinary.js";

const createLsatSession = async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            sessionType,
            tutor,
            packageId,
            currentScore,
            targetScore,
            weakAreas,
            studyMaterials,
            previousTutoring,
            specificGoals,
            dateTime,
            notes,
            numberOfStudents = 1,
            price = 0,
            pricePerPerson = 0
        } = req.body;

        const document = req.files;

        // Required fields validation
        if (!fullName || !email || !phone || !sessionType || !tutor || !targetScore || !weakAreas || !previousTutoring || !specificGoals || !dateTime) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be filled.'
            });
        }

        // Validate session type
        if (!['free', 'one-on-one', 'class'].includes(sessionType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid session type.'
            });
        }

        // Validate number of students for class sessions
        if (sessionType === 'class') {
            if (!numberOfStudents || numberOfStudents < 2 || numberOfStudents > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'Class sessions require 2-5 students.'
                });
            }
        }

        // For 1-on-1 sessions, check and deduct package session
        let packagePurchaseId = null;
        if (sessionType === 'one-on-one') {
            if (!packageId) {
                return res.status(400).json({
                    success: false,
                    message: 'Package selection is required for 1-on-1 sessions.'
                });
            }

            // Find active package for user
            const activePackage = await LSATPackagePurchase.findOne({
                _id: packageId,
                userEmail: email,
                status: 'active',
                sessionsRemaining: { $gt: 0 },
                expiresAt: { $gt: new Date() }
            });

            if (!activePackage) {
                return res.status(400).json({
                    success: false,
                    message: 'No valid package found or sessions exhausted. Please purchase a package first.'
                });
            }

            // Deduct one session
            activePackage.sessionsRemaining -= 1;

            // Update status if no sessions left
            if (activePackage.sessionsRemaining === 0) {
                activePackage.status = 'completed';
            }

            await activePackage.save();
            packagePurchaseId = activePackage._id;
        }

        let uploaded = [];
        if (document && document.length > 0) {
            const uploadArray = document.map((doc) => uploadDocsOnCloudinary(doc));
            uploaded = await Promise.all(uploadArray);

            if (!uploaded || uploaded.some(doc => !doc)) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to upload documents.'
                });
            }
        }

        const lsatSession = await LsatSession.create({
            fullName,
            email,
            phone,
            sessionType,
            tutor,
            packageId: sessionType === 'one-on-one' ? packageId : undefined,
            packagePurchaseId,
            currentScore,
            targetScore,
            weakAreas,
            studyMaterials,
            previousTutoring,
            specificGoals,
            dateTime,
            notes,
            numberOfStudents: sessionType === 'class' ? numberOfStudents : 1,
            price,
            pricePerPerson: sessionType === 'class' ? pricePerPerson : undefined,
            document: uploaded,
            payment: sessionType === 'class' ? false : true // Free and one-on-one sessions don't need payment
        });

        if (!lsatSession) {
            return res.status(500).json({
                success: false,
                message: 'Failed to book LSAT session.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'LSAT session booked successfully',
            data: lsatSession
        });
    } catch (error) {
        console.error('Create LSAT session error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

const getLsatSession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const lsatSession = await LsatSession.findById(sessionId)
            .populate('packageId', 'title sessions duration')
            .populate('tutor', 'fullName image email')
            .populate('packagePurchaseId', 'sessionsRemaining expiresAt');

        if (!lsatSession) {
            return res.status(404).json({
                success: false,
                message: 'LSAT session not found.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'LSAT session fetched successfully',
            data: lsatSession
        });
    } catch (error) {
        console.error('Get LSAT session error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

const getAllLsatSessions = async (req, res) => {
    try {
        const lsatSessions = await LsatSession.find()
            .populate('packageId', 'title sessions duration')
            .populate('tutor', 'fullName image email')
            .sort({ createdAt: -1 });

        if (!lsatSessions) {
            return res.status(500).json({
                success: false,
                message: 'Could not fetch LSAT sessions.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'LSAT sessions fetched successfully',
            data: lsatSessions
        });
    } catch (error) {
        console.error('Get all LSAT sessions error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

const updateLsatSessionStatus = async (req, res) => {
    try {
        const { sessionId } = req.params;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: 'Session ID is required.'
            });
        }

        const lsatSession = await LsatSession.findByIdAndUpdate(
            sessionId,
            { status: true },
            { new: true }
        ).populate('packageId', 'title sessions duration')
            .populate('tutor', 'fullName image email');

        if (!lsatSession) {
            return res.status(404).json({
                success: false,
                message: 'LSAT session not found.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Session status updated successfully',
            data: lsatSession
        });
    } catch (error) {
        console.error('Update session status error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

const getLsatSessionsOfUser = async (req, res) => {
    try {
        const user = req.user;

        const lsatSessions = await LsatSession.find({ email: user.email })
            .populate('packageId', 'title sessions duration')
            .populate('tutor', 'fullName image email')
            .sort({ createdAt: -1 });

        if (!lsatSessions) {
            return res.status(500).json({
                success: false,
                message: 'Could not fetch user LSAT sessions.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User LSAT sessions fetched successfully',
            data: lsatSessions
        });
    } catch (error) {
        console.error('Get user LSAT sessions error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

const updateLsatSessionEmailStatus = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { emailSent } = req.body;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: 'Session ID is required.'
            });
        }

        const lsatSession = await LsatSession.findByIdAndUpdate(
            sessionId,
            { emailSent },
            { new: true }
        ).populate('packageId', 'title sessions duration')
            .populate('tutor', 'fullName image email');

        if (!lsatSession) {
            return res.status(404).json({
                success: false,
                message: 'LSAT session not found.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Email status updated successfully',
            data: lsatSession
        });
    } catch (error) {
        console.error('Update email status error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

const markSessionAsCompleted = async (req, res) => {
    try {
        const { sessionId } = req.params;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: 'Session ID is required.'
            });
        }

        const lsatSession = await LsatSession.findByIdAndUpdate(
            sessionId,
            { sessionCompleted: true },
            { new: true }
        ).populate('packageId', 'title sessions duration')
            .populate('tutor', 'fullName image email');

        if (!lsatSession) {
            return res.status(404).json({
                success: false,
                message: 'LSAT session not found.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Session marked as completed',
            data: lsatSession
        });
    } catch (error) {
        console.error('Mark session as completed error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

const getLsatSessionsOfTutor = async (req, res) => {
    try {
        const tutor = req.tutor; // This comes from verifyTutor middleware

        const lsatSessions = await LsatSession.find({ tutor: tutor._id })
            .populate('packageId', 'title sessions duration')
            .populate('packagePurchaseId', 'sessionsRemaining expiresAt')
            .sort({ dateTime: 1 }); // Sort by session date ascending

        if (!lsatSessions) {
            return res.status(500).json({
                success: false,
                message: 'Could not fetch tutor LSAT sessions.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Tutor LSAT sessions fetched successfully',
            data: lsatSessions
        });
    } catch (error) {
        console.error('Get tutor LSAT sessions error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

export {
    createLsatSession,
    getLsatSession,
    getAllLsatSessions,
    updateLsatSessionStatus,
    getLsatSessionsOfUser,
    updateLsatSessionEmailStatus,
    markSessionAsCompleted,
    getLsatSessionsOfTutor,
}