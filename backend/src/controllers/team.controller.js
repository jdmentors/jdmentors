import Team from "../models/team.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addTeam = async (req, res) => {
    try {
        const { fullName, designation, image = '' } = req.body;

        const uploadedImg = req.files[0];

        if (!fullName || !designation || !uploadedImg) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        let image_url;

        if (uploadedImg) {
            image_url = await uploadOnCloudinary(uploadedImg?.buffer);
        }

        const addedTeam = await Team.create({ fullName, designation, image: image_url });

        if (!addedTeam) {
            return res.status(500).json({ success: false, message: 'Could not create team member.' });
        }

        return res.status(200).json({ success: true, message: 'Team member added'});
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message});
    }
}

const getAllTeam = async (req, res) => {
    try {
        const allTeam = await Team.find();

        if (!allTeam) {
            return res.status(404).json({ success: false, message: 'No Users found' });
        }

        return res.status(200).json({ success: true, message: 'Users found', data: allTeam });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to get User' });
    }
}

const getATeam = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: 'Member ID is needed' });
        }

        const member = await Team.findById(id);

        if (!member) {
            return res.status(404).json({ success: false, message: 'No member found' });
        }

        return res.status(200).json({ success: true, message: 'Member found', data: member });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to get member' });
    }
}

const updateTeam = async (req, res) => {
    try {
        const { id } = req.params;
        
        const { fullName, designation, image } = req.body;
        const uploadedImg = req.files[0];

        if (!fullName || !designation) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const foundTeamMember = await Team.findById(id);

        if(!foundTeamMember){
            return res.status(404).json({ success: false, message: 'No such member found.' });
        }

        let image_url;

        if (uploadedImg) {
            image_url = await uploadOnCloudinary(uploadedImg?.buffer);
        }

        const updatedTeam = await Team.findByIdAndUpdate(id, {fullName, designation, image: image_url || image});

        if (!updateTeam) {
            return res.status(400).json({ success: false, message: 'Member updation failed.' });
        }

        return res.status(200).json({ success: true, message: 'Member updated'});
    } catch (error) {
        throw new Error(error.message);
    }
}

const deleteTeam = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: 'Member ID needed to delete' });
        }

        const member = await Team.findByIdAndDelete(id);

        if (!member) {
            return res.status(500).json({ success: false, message: 'No member found' });
        }

        return res.status(200).json({ success: true, message: 'Member deleted' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Deletion failed' });
    }
}

export {
    addTeam,
    getAllTeam,
    getATeam,
    updateTeam,
    deleteTeam,
}