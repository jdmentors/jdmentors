import Accommodation from "../models/accommodation.model.js";
import { uploadDocsOnCloudinary } from "../utils/cloudinary.js";

const createAccommodation = async (req, res) => {
    try {
        const { fullName, email, phone, dateTime = '', preferredContact = [], exam = [], seekingAccommodations = '', price, supportingDocumentation = '', previousAccommodation = '', providedAccommodations = '', additionalInfomation = '' } = req.body;

        const document = req.files;

        if (!fullName || !email || !phone || !price) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        // let uploaded = await uploadDocsOnCloudinary(document);
        let uploadArray = document.map((doc) => uploadDocsOnCloudinary(doc));

        const uploaded = await Promise.all(uploadArray);

        if (!uploaded) {
            return res.status(500).json({ success: false, message: 'Failed to upload docs.' });
        }

        const accommodation = await Accommodation.create({ fullName, email, phone, preferredContact, exam, seekingAccommodations, supportingDocumentation, dateTime, previousAccommodation, providedAccommodations, additionalInfomation, document: uploaded || '', price });

        if (!accommodation) {
            return res.status(500).json({ success: false, message: 'Failed to book accommodation.' });
        }

        return res.status(200).json({ success: true, message: 'Redirecting to payment', data: accommodation });
    } catch (error) {
        throw new Error(error);
    }
}

const getAnAccommodation = async (req, res) => {
    try {
        const { accommodationId } = req.params;

        const accommodation = await Accommodation.findById(accommodationId);

        if (!accommodation) {
            return res.status(500).json({ success: false, message: 'Could not find the accommodation.' });
        }

        return res.status(200).json({ success: true, message: 'Accommodation fetched', data: accommodation });
    } catch (error) {
        throw new Error(error);
    }
}

const getAllAccommodations = async (req, res) => {
    try {
        const accommodations = await Accommodation.find().sort({ createdAt: -1 });

        if (!accommodations) {
            return res.status(500).json({ success: false, message: 'Could not find the accommodations.' });
        }

        return res.status(200).json({ success: true, message: 'Accommodations fetched', data: accommodations });
    } catch (error) {
        throw new Error(error);
    }
}

const updateAccommodationStatus = async (req, res) => {
    try {
        const { accommodationId } = req.params;

        if (!accommodationId) {
            return res.status(400).json({ success: false, message: 'Accommodation ID is needed.' });
        }

        const accommodation = await Accommodation.findByIdAndUpdate(accommodationId, { status: true }, { new: true });

        if (!accommodation) {
            return res.status(500).json({ success: false, message: 'Failed to update status.' });
        }

        return res.status(200).json({ success: true, message: 'Status marked as done', data: accommodation });
    } catch (error) {
        throw new Error(error);
    }
}

const getAccommodationsOfUser = async (req, res) => {
    try {
        const user = req.user;

        const accommodations = await Accommodation.find({ email: user.email }).sort({ createdAt: -1 });

        if (!accommodations) {
            return res.status(500).json({ success: false, message: 'Could not find the accommodations.' });
        }

        return res.status(200).json({ success: true, message: 'accommodations fetched', data: accommodations });
    } catch (error) {
        throw new Error(error);
    }
}

const updateAccommodationEmailStatus = async (req, res) => {
    try {
        const { accommodationId } = req.params;
        const { emailSent } = req.body;

        if (!accommodationId) {
            return res.status(400).json({ success: false, message: 'Accommodation ID is needed.' });
        }

        const accommodation = await Accommodation.findByIdAndUpdate(accommodationId, { emailSent }, { new: true });

        if (!accommodation) {
            return res.status(500).json({ success: false, message: 'Failed to update status.' });
        }

        return res.status(200).json({ success: true, message: 'Status marked as done', data: accommodation });
    } catch (error) {
        throw new Error(error);
    }
}

export {
    createAccommodation,
    getAnAccommodation,
    getAllAccommodations,
    updateAccommodationStatus,
    getAccommodationsOfUser,
    updateAccommodationEmailStatus,
}