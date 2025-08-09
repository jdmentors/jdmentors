import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

const configureCloudinary = async () => {
    try {
        const configured = cloudinary.config({
            cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
            api_key: `${process.env.CLOUDINARY_API_KEY}`,
            api_secret: `${process.env.CLOUDINARY_API_SECRET}`
        });

        if (configured) {
            console.log('Cloudinary configured.');
        }
    } catch (error) {
        throw new Error(error);
    }
}

const uploadOnCloudinary = async (file) => {
    try {
        const uploaded = await cloudinary.uploader.upload(file);

        if (uploaded) {
            fs.unlinkSync(file);
            return uploaded.secure_url;
        }
    } catch (error) {
        throw new Error(error);
    }
}

const uploadDocsOnCloudinary = async (file) => {
    try {
        const uploaded = await cloudinary.uploader.upload(file, {
            resource_type: 'auto',
        });

        if (uploaded) {
            fs.unlinkSync(file);
            return uploaded.secure_url;
        }
    } catch (error) {
        throw new Error(error);
    }
}


export { configureCloudinary, uploadOnCloudinary, uploadDocsOnCloudinary }