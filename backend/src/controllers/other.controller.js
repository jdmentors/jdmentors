import User from "../models/user.model.js";
import Blog from "../models/blog.model.js";
import Service from "../models/service.model.js";
import Package from "../models/package.model.js";
import Addon from "../models/addon.model.js";
import Extra from "../models/extra.model.js";
import Session from "../models/session.model.js";
import { userExists } from "./user.controller.js";
import { accommodationAdminEmail, accommodationUserEmail, contactEmail, orderAdminEmail, orderUserEmail } from "../utils/nodemailer.js";

const dashboard = async (req, res) => {
    try {
        const [userCount, blogCount, serviceCount, packageCount, addonCount, extraCount, sessionCount, adminCount, revenue] = await Promise.all([
            User.countDocuments(),
            Blog.countDocuments(),
            Service.countDocuments(),
            Package.countDocuments(),
            Addon.countDocuments(),
            Extra.countDocuments(),
            Session.countDocuments(),
            User.countDocuments({ userType: 'admin' }),
            Session.aggregate([
                {
                    $group: {
                        _id: null,
                        totalPrice: { $sum: '$price' }
                    }
                }
            ])
        ]);

        const totalRevenue = revenue.length > 0 ? revenue[0].totalPrice : 0;

        return res.status(200).json({
            success: true,
            data: {
                userCount,
                blogCount,
                serviceCount,
                packageCount,
                addonCount,
                extraCount,
                sessionCount,
                adminCount,
                totalRevenue
            }
        });
    } catch (error) {
        throw new Error(error);
    }
}

const createAdmin = async (req, res) => {
    try {
        const { fullName, email, phone = '', image = '', password, userType = 'admin' } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const existingUser = await userExists(email);

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists.' });
        }

        const createdUser = await User.create({ fullName, email, phone, password, image, userType });

        return res.status(200).json({ success: true, message: 'Admin created' });
    } catch (error) {
        throw new Error(error);
    }
}

const sendOrderEmail = async (req, res) => {
    try {
        const { fullName, email, phone, service, addonsAndExtras = 'Not Included', document, dateTime = 'No Date', notes = 'Not Provided', price, sessionId } = req.body;

        if (!fullName || !email || !phone || !service || !document || !price || !sessionId) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const adminEmailSent = await orderAdminEmail(fullName, phone, email, service, addonsAndExtras, document, dateTime, notes, price);
        const userEmailSent = await orderUserEmail(email, service, addonsAndExtras, document, dateTime, notes, price, sessionId);

        if (!adminEmailSent || !userEmailSent) {
            return res.status(500).json({ success: false, message: 'Could not send email.' });
        }

        return res.status(200).json({ success: true });
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

        if (!contactEmailSent) {
            return res.status(500).json({ success: false, message: 'Could not send email.' });
        }

        return res.status(200).json({ success: true, message: 'Message Sent' });
    } catch (error) {
        throw new Error(error);
    }
}

const sendAccommodationEmail = async (req, res) => {
    try {
        const { fullName, email, phone, preferredContact = 'Not Specified', exam = 'Not Specified', document = 'Not Provided', dateTime = 'Not Specified', seekingAccommodations = 'Not Specified', supportingDocumentation = 'Not Specified', previousAccommodation = 'Not Specified', additionalInfomation = 'Not Specified', price, accommodationId, payment = 'Pending' } = req.body;

        if (!fullName || !email || !phone || !exam || !document || !price || !accommodationId) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const adminEmailSent = await accommodationAdminEmail(fullName, email, phone, preferredContact, exam, document, dateTime, seekingAccommodations, supportingDocumentation, previousAccommodation, additionalInfomation, price, accommodationId, payment);

        const userEmailSent = await accommodationUserEmail(fullName, email, phone, preferredContact, exam, document, dateTime, seekingAccommodations, supportingDocumentation, previousAccommodation, additionalInfomation, price, accommodationId, payment);

        if (!adminEmailSent || !userEmailSent) {
            return res.status(500).json({ success: false, message: 'Could not send email.' });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        throw new Error(error);
    }
}

export {
    dashboard,
    createAdmin,
    sendOrderEmail,
    sendContactEmail,
    sendAccommodationEmail,
}