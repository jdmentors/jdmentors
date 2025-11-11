import jwt from "jsonwebtoken";
import Tutor from "../models/tutor.model.js";

const verifyTutor = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized request' });
        }

        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

        if (verified) {
            const tutor = await Tutor.findById(verified.id).select('-password -refreshToken');
            
            if (!tutor) {
                return res.status(401).json({ success: false, message: 'Invalid access token' });
            }

            if (!tutor.isActive) {
                return res.status(403).json({ success: false, message: 'Tutor account is deactivated' });
            }

            req.tutor = tutor;
            next();
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false, message: 'Unauthorized request' });
    }
}

export default verifyTutor;