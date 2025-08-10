import Session from "../models/session.model.js";
import { uploadDocsOnCloudinary } from "../utils/cloudinary.js";

const createSession = async (req, res) => {
    try {
        const { dateTime='', service } = req.body;

        const document = req.file;

        if(!service || !document){
            return res.status(400).json({success:false, message:'All fields are required.'});
        }

        const user = req.user;

        const uploaded = await uploadDocsOnCloudinary(document?.path);

        if(!uploaded){
            return res.status(500).json({success:false, message:'Failed to upload doc.'});
        }

        const session = await Session.create({ user: user._id, service, dateTime, document: uploaded || '' });

        if(!session){
            return res.status(500).json({success:false, message:'Failed to book session.'});
        }

        return res.status(200).json({success: true, message: 'Session booked', data: session});
    } catch (error) {
        throw new Error(error.message);
    }
}

const getSessionsOfUser = async (req, res) => {
    try {
        const user = req.user;

        const sessions = await Session.find({user: user._id}).populate("service");

        if(!sessions){
            return res.status(500).json({success:false, message: 'Could not find the sessions.'});
        }

        return res.status(200).json({success: true, message: 'Sessions fetched', data: sessions});
    } catch (error) {
        throw new Error(error);
    }
}

const getAllSessions = async (req, res) => {
    try {
        const sessions = await Session.find().populate("service user");

        if(!sessions){
            return res.status(500).json({success:false, message: 'Could not find the sessions.'});
        }

        return res.status(200).json({success: true, message: 'Sessions fetched', data: sessions});
    } catch (error) {
        throw new Error(error);
    }
}

const updateSessionStatus = async (req, res) => {
    try {
        const { sessionId } = req.params;

        if(!sessionId){
            return res.status(400).json({success:false, message: 'Session ID is needed.'});
        }

        const session = await Session.findByIdAndUpdate(sessionId, {status: true}, {new: true});

        if(!session){
            return res.status(500).json({success: false, message: 'Failed to update status.'});
        }

        return res.status(200).json({success: true, message: 'Status updated', data: session});
    } catch (error) {
        throw new Error(error);
    }
}

export {
    createSession,
    getSessionsOfUser,
    getAllSessions,
    updateSessionStatus,
}