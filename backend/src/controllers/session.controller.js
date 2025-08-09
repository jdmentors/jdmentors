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

export {
    createSession,
}