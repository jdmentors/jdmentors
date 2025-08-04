import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const verifyUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const { id } = await jwt.decode(token);

        const user = await User.findById(id);
        req.user = user;

        next();
    } catch (error) {
        throw new Error(error);
    }
}

export default verifyUser;