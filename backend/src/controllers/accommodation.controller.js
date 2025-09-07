import Accommodation from "../models/accommodation.model.js";
import { uploadDocsOnCloudinary } from "../utils/cloudinary.js";

const createAccommodation = async (req, res) => {
    try {
        const { fullName, email, phone, dateTime = '', preferredContact = [], exam = [], seekingAccommodations = '', price, supportingDocumentation = '', previousAccommodation = '', additionalInfomation = '' } = req.body;

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

        const accommodation = await Accommodation.create({ fullName, email, phone, preferredContact, exam, seekingAccommodations, supportingDocumentation, dateTime, previousAccommodation, additionalInfomation, document: uploaded || '', price });

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

export {
    createAccommodation,
    getAnAccommodation,
}