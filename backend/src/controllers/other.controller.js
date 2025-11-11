import User from "../models/user.model.js";
import Blog from "../models/blog.model.js";
import Service from "../models/service.model.js";
import Package from "../models/package.model.js";
import Addon from "../models/addon.model.js";
import Extra from "../models/extra.model.js";
import Session from "../models/session.model.js";
import { userExists } from "./user.controller.js";
import { accommodationAdminEmail, accommodationUserEmail, contactEmail, lsatSessionAdminEmail, lsatSessionTutorEmail, lsatSessionUserEmail, orderAdminEmail, orderUserEmail } from "../utils/nodemailer.js";
import Accommodation from "../models/accommodation.model.js";
import Team from "../models/team.model.js";
import Other from "../models/other.model.js";

const dashboard = async (req, res) => {
    try {
        const [userCount, blogCount, serviceCount, packageCount, addonCount, extraCount, sessionCount, accommodationCount, adminCount, teamCount, revenue, accommodationRevenue] = await Promise.all([
            User.countDocuments(),
            Blog.countDocuments(),
            Service.countDocuments(),
            Package.countDocuments(),
            Addon.countDocuments(),
            Extra.countDocuments(),
            Session.countDocuments(),
            Accommodation.countDocuments(),
            User.countDocuments({ userType: 'admin' }),
            Team.countDocuments(),
            Session.aggregate([
                {
                    $group: {
                        _id: null,
                        totalPrice: { $sum: '$price' }
                    }
                }
            ]),
            Accommodation.aggregate([
                {
                    $group: {
                        _id: null,
                        totalPrice: { $sum: '$price' }
                    }
                }
            ])
        ]);

        const totalRevenue = revenue.length > 0 ? revenue[0].totalPrice : 0;
        const totalAccommodationRevenue = accommodationRevenue.length > 0 ? accommodationRevenue[0].totalPrice : 0;

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
                accommodationCount,
                adminCount,
                teamCount,
                totalRevenue,
                totalAccommodationRevenue,
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
        const { fullName, email, phone, preferredContact = 'Not Specified', otherContactMethod= '', exam = 'Not Specified', document = 'Not Provided', dateTime = 'Not Specified', seekingAccommodations = 'Not Specified', supportingDocumentation = 'Not Specified', previousAccommodation = 'Not Specified', providedAccommodations = 'Not specified', additionalInfomation = 'Not Specified', price, accommodationId, payment = 'Pending' } = req.body;

        if (!fullName || !email || !phone || !exam || !document || !accommodationId) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const adminEmailSent = await accommodationAdminEmail(fullName, email, phone, preferredContact, otherContactMethod, exam, document, dateTime, seekingAccommodations, supportingDocumentation, previousAccommodation, providedAccommodations, additionalInfomation, price, accommodationId, payment);

        const userEmailSent = await accommodationUserEmail(fullName, email, phone, preferredContact, otherContactMethod, exam, document, dateTime, seekingAccommodations, supportingDocumentation, previousAccommodation, providedAccommodations, additionalInfomation, price, accommodationId, payment);

        if (!adminEmailSent || !userEmailSent) {
            return res.status(500).json({ success: false, message: 'Could not send email.' });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        throw new Error(error);
    }
}

const updateAccommodationPrice = async (req, res) => {
    try {
        const { price } = req.body;

        if (!price) {
            return res.status(400).json({ success: false, message: 'Price is required.' });
        }

        const accommodation = await Other.findByIdAndUpdate('68bec5594f93415fb2f735c9', {accommodationPrice: price}, {new: true});

        if (!accommodation) {
            return res.status(500).json({ success: false, message: 'Could not update price.' });
        }

        return res.status(200).json({success: true, message: 'Price updated', data: accommodation,})
    } catch (error) {
        return res.status(500).json({success: false, message: error?.message});
    }
}

// const getAllOthers = async (req, res) => {
//     try {
//         const others = await Other.find();

//         if (!others) {
//             return res.status(500).json({ success: false, message: 'Could not find the other data.' });
//         }

//         return res.status(200).json({success: true, message: 'Price fetched', data: others})
//     } catch (error) {
//         return res.status(500).json({success: false, message: error?.message});
//     }
// }

const sendLsatSessionEmail = async (req, res) => {
    try {
        const { 
            fullName, 
            email, 
            phone, 
            sessionType, 
            tutorName, 
            tutorEmail,  // Add this
            tutorSchool, 
            currentScore, 
            targetScore, 
            weakAreas, 
            studyMaterials, 
            previousTutoring, 
            specificGoals, 
            dateTime, 
            notes, 
            numberOfStudents, 
            price, 
            pricePerPerson, 
            document, 
            sessionId, 
            payment = false 
        } = req.body;

        // Required fields validation
        if (!fullName || !email || !phone || !sessionType || !tutorName || !tutorEmail || !targetScore || !weakAreas || !previousTutoring || !specificGoals || !dateTime || !sessionId) {
            return res.status(400).json({ 
                success: false, 
                message: 'All required fields are missing.' 
            });
        }

        const adminEmailSent = await lsatSessionAdminEmail(
            fullName, email, phone, sessionType, tutorName, tutorSchool, 
            currentScore, targetScore, weakAreas, studyMaterials, 
            previousTutoring, specificGoals, dateTime, notes, 
            numberOfStudents, price, pricePerPerson, document, sessionId, payment
        );

        const userEmailSent = await lsatSessionUserEmail(
            fullName, email, phone, sessionType, tutorName, tutorSchool, 
            currentScore, targetScore, weakAreas, studyMaterials, 
            previousTutoring, specificGoals, dateTime, notes, 
            numberOfStudents, price, pricePerPerson, document, sessionId, payment
        );

        const tutorEmailSent = await lsatSessionTutorEmail(
            tutorEmail, tutorName, fullName, email, phone, sessionType,
            currentScore, targetScore, weakAreas, studyMaterials,
            previousTutoring, specificGoals, dateTime, notes,
            numberOfStudents, document, sessionId
        );

        if (!adminEmailSent || !userEmailSent || !tutorEmailSent) {
            return res.status(500).json({ 
                success: false, 
                message: 'Could not send all emails.' 
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: 'LSAT session emails sent successfully to admin, user, and tutor' 
        });
    } catch (error) {
        console.error('Send LSAT session email error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to send LSAT session emails' 
        });
    }
}

// Get all pricing data
const getAllOthers = async (req, res) => {
    try {
        const others = await Other.find();

        if (!others) {
            return res.status(500).json({ success: false, message: 'Could not find the other data.' });
        }

        return res.status(200).json({success: true, message: 'Price fetched', data: others})
    } catch (error) {
        return res.status(500).json({success: false, message: error?.message});
    }
}

// Get specific pricing by number of people
const getPricingByPeople = async (req, res) => {
    try {
        const { people } = req.params;
        const other = await Other.findOne({ 'pricing.numberOfPeople': parseInt(people) });
        
        if (!other) {
            return res.status(404).json({ success: false, message: 'Pricing not found for specified number of people.' });
        }

        const pricing = other.pricing.find(p => p.numberOfPeople === parseInt(people));
        return res.status(200).json({ success: true, message: 'Pricing fetched', data: pricing });
    } catch (error) {
        return res.status(500).json({ success: false, message: error?.message });
    }
}

// Update pricing
const updatePricing = async (req, res) => {
    try {
        const { numberOfPeople, perPerson, total } = req.body;

        // Validate input
        if (!numberOfPeople || !perPerson || !total) {
            return res.status(400).json({ success: false, message: 'All fields are required: numberOfPeople, perPerson, total' });
        }

        if (![2, 3, 4, 5].includes(numberOfPeople)) {
            return res.status(400).json({ success: false, message: 'Number of people must be between 2 and 5' });
        }

        // Find the document (assuming you have one main document for pricing)
        let other = await Other.findOne();
        
        if (!other) {
            // Create new document if doesn't exist
            other = new Other({
                name: "accommodation_pricing",
                pricing: []
            });
        }

        // Check if pricing for this number of people already exists
        const existingPricingIndex = other.pricing.findIndex(p => p.numberOfPeople === numberOfPeople);
        
        if (existingPricingIndex > -1) {
            // Update existing pricing
            other.pricing[existingPricingIndex] = {
                numberOfPeople,
                perPerson,
                total
            };
        } else {
            // Add new pricing
            other.pricing.push({
                numberOfPeople,
                perPerson,
                total
            });
        }

        other.lastUpdated = new Date();
        await other.save();

        return res.status(200).json({ 
            success: true, 
            message: 'Pricing updated successfully', 
            data: other 
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error?.message });
    }
}

// Get all pricing in a formatted object (similar to your original const)
const getAllPricing = async (req, res) => {
    try {
        const other = await Other.findOne();
        
        if (!other || !other.pricing || other.pricing.length === 0) {
            return res.status(404).json({ success: false, message: 'No pricing data found.' });
        }

        // Format the pricing data into the object structure you had
        const formattedPricing = {};
        other.pricing.forEach(item => {
            formattedPricing[item.numberOfPeople] = {
                perPerson: item.perPerson,
                total: item.total
            };
        });

        return res.status(200).json({ 
            success: true, 
            message: 'Pricing fetched successfully', 
            data: formattedPricing 
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error?.message });
    }
}

// Initialize default pricing (useful for first-time setup)
const initializeDefaultPricing = async (req, res) => {
    try {
        const defaultPricing = [
            { numberOfPeople: 2, perPerson: 70, total: 140 },
            { numberOfPeople: 3, perPerson: 65, total: 195 },
            { numberOfPeople: 4, perPerson: 60, total: 240 },
            { numberOfPeople: 5, perPerson: 55, total: 275 }
        ];

        let other = await Other.findOne();
        
        if (!other) {
            other = new Other({
                name: "accommodation_pricing",
                pricing: defaultPricing
            });
        } else {
            other.pricing = defaultPricing;
        }

        other.lastUpdated = new Date();
        await other.save();

        return res.status(200).json({ 
            success: true, 
            message: 'Default pricing initialized successfully', 
            data: other 
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error?.message });
    }
}

export {
    dashboard,
    createAdmin,
    sendOrderEmail,
    sendContactEmail,
    sendAccommodationEmail,
    updateAccommodationPrice,
    getAllOthers,
    sendLsatSessionEmail,
    getPricingByPeople,
    updatePricing,
    getAllPricing,
    initializeDefaultPricing,
}