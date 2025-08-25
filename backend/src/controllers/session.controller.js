import Session from "../models/session.model.js";
import { uploadDocsOnCloudinary } from "../utils/cloudinary.js";

const createSession = async (req, res) => {
    try {
        const { fullName, email, phone, dateTime = null, notes = null, service, price } = req.body;

        const document = req.files;

        if (!service || !document || !fullName || !email || !phone || !price) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        // let uploaded = await uploadDocsOnCloudinary(document);
        let uploadArray = document.map((doc) => uploadDocsOnCloudinary(doc));

        const uploaded = await Promise.all(uploadArray);

        if (!uploaded) {
            return res.status(500).json({ success: false, message: 'Failed to upload docs.' });
        }

        const session = await Session.create({ fullName, email, phone, service, price, dateTime, notes, document: uploaded || '' });

        if (!session) {
            return res.status(500).json({ success: false, message: 'Failed to book session.' });
        }

        return res.status(200).json({ success: true, message: 'Redirecting to payment', data: session });
    } catch (error) {
        throw new Error(error);
    }
}

const getSessionsOfUser = async (req, res) => {
    try {
        const user = req.user;

        const sessions = await Session.find({ email: user.email }).populate("service").sort({ createdAt: -1 });

        if (!sessions) {
            return res.status(500).json({ success: false, message: 'Could not find the sessions.' });
        }

        return res.status(200).json({ success: true, message: 'Sessions fetched', data: sessions });
    } catch (error) {
        throw new Error(error);
    }
}

const getAllSessions = async (req, res) => {
    try {
        const sessions = await Session.find().populate("service").sort({ createdAt: -1 });

        if (!sessions) {
            return res.status(500).json({ success: false, message: 'Could not find the sessions.' });
        }

        return res.status(200).json({ success: true, message: 'Sessions fetched', data: sessions });
    } catch (error) {
        throw new Error(error);
    }
}

const updateSessionStatus = async (req, res) => {
    try {
        const { sessionId } = req.params;

        if (!sessionId) {
            return res.status(400).json({ success: false, message: 'Session ID is needed.' });
        }

        const session = await Session.findByIdAndUpdate(sessionId, { status: true }, { new: true });

        if (!session) {
            return res.status(500).json({ success: false, message: 'Failed to update status.' });
        }

        return res.status(200).json({ success: true, message: 'Status marked as done', data: session });
    } catch (error) {
        throw new Error(error);
    }
}

const getASession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await Session.findById(sessionId)
            .select('fullName email phone price dateTime notes document status payment createAt')
            .populate({
                path: 'service',
                select: 'title price description features'
            });

        if (!session) {
            return res.status(500).json({ success: false, message: 'Could not find the session.' });
        }

        return res.status(200).json({ success: true, message: 'Session fetched', data: session });
    } catch (error) {
        throw new Error(error);
    }
}

export {
    createSession,
    getSessionsOfUser,
    getAllSessions,
    updateSessionStatus,
    getASession
}