import User from "../models/user.model.js";
import Blog from "../models/blog.model.js";
import Service from "../models/service.model.js";
import Session from "../models/session.model.js";
import { userExists } from "./user.controller.js";
import { contactEmail, orderAdminEmail, orderUserEmail } from "../utils/nodemailer.js";

const dashboard = async (req, res) => {
    try {
        const [userCount, blogCount, serviceCount, sessionCount, adminCount, revenue] = await Promise.all([
            User.countDocuments(),
            Blog.countDocuments(),
            Service.countDocuments(),
            Session.countDocuments(),
            User.countDocuments({ userType: 'admin' }),
            Session.aggregate([
                {
                    $lookup: {
                        from: 'services',
                        localField: 'service',
                        foreignField: '_id',
                        as: 'services'
                    }
                },
                { $unwind: '$services' },
                {
                    $group: {
                        _id: null,
                        totalPrice: { $sum: '$services.price' }
                    }
                }
            ])
        ]);

        return res.status(200).json({
            success: true,
            data: {
                userCount,
                blogCount,
                serviceCount,
                sessionCount,
                adminCount,
                revenue
            }
        });
    } catch (error) {
        throw new Error(error);
    }
}

const createAdmin = async (req, res) => {
    try {
        const { fullName, email, phone = '', image = '', password, userType='admin' } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const existingUser = await userExists(email);

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists.' });
        }

        const createdUser = await User.create({ fullName, email, phone, password, image, userType });

        return res.status(200).json({success: true, message: 'Admin created'});
    } catch (error) {
        throw new Error(error);
    }
}

const sendOrderEmail = async (req, res) => {
    try {
        const { fullName, email, phone, service, document, dateTime, price } = req.body;

        if (!fullName || !email || !phone || !service || !document || !dateTime || !price) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const adminEmailSent = await orderAdminEmail(fullName, phone, email, service, document, dateTime, price);
        const userEmailSent = await orderUserEmail(email, service, document, dateTime, price);

        if(!adminEmailSent || !userEmailSent){
            return res.status(500).json({ success: false, message: 'Could not send email.' });
        }

        return res.status(200).json({ success: true});
    } catch (error) {
        throw new Error(error);
    }
}

const sendContactEmail = async (req, res) => {
    try {
        const { name, email, phone, service, message } = req.body;

        if (!name || !email || !phone || !service || !message) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const contactEmailSent = await contactEmail(name, email, phone, service, message);

        if(!contactEmailSent){
            return res.status(500).json({ success: false, message: 'Could not send email.' });
        }

        return res.status(200).json({ success: true, message: 'Message Sent'});
    } catch (error) {
        throw new Error(error);
    }
}

export {
    dashboard,
    createAdmin,
    sendOrderEmail,
    sendContactEmail
}