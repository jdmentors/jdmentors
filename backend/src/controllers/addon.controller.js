import Addon from "../models/addon.model.js";

const createAddon = async (req, res) => {
    try {
        const { title, description, price, order, status = true, isDocumentRequired } = req.body;

        const user = req.user;

        if (!title || !description || !price) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        if (!user) {
            return res.status(401).json({ success: false, message: 'Could not verify admin' });
        }

        const addonExists = await Addon.findOne({ title });

        if (addonExists) {
            return res.status(400).json({ success: false, message: 'Addon already exists with this title' });
        }

        const addon = await Addon.create({ title, description, price, order, status, user: user._id, isDocumentRequired });

        if (!addon) {
            return res.status(500).json({ success: false, message: 'Error occured while creating addon' });
        }

        return res.status(200).json({ success: true, message: 'Add-on created' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Add-on creation failed' });
    }
}

const getAllAddons = async (req, res) => {
    try {
        const allAddons = await Addon.aggregate([
            {
                $sort: { order: 1 }
            },
            {
                $lookup: {
                    from: 'sessions',
                    let: { addonId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$service', '$$addonId'] }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                sessionCount: { $sum: 1 },
                                totalRevenue: { $sum: '$price' }
                            }
                        }
                    ],
                    as: 'sessionStats'
                }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    price: 1,
                    status: 1,
                    createdAt: 1,
                    sessionCount: {
                        $ifNull: [{ $arrayElemAt: ['$sessionStats.sessionCount', 0] }, 0]
                    },
                    totalRevenue: {
                        $ifNull: [{ $arrayElemAt: ['$sessionStats.totalRevenue', 0] }, 0]
                    }
                }
            }
        ]);


        if (!allAddons) {
            return res.status(404).json({ success: false, message: 'No add-ons found' });
        }

        return res.status(200).json({ success: true, message: 'Add-ons found', data: allAddons });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to get add-ons' });
    }
}

const updateAvailability = async (req, res) => {
    try {
        const { status } = req.body;

        const { addonId } = req.params;

        if (!addonId) {
            return res.status(400).json({ success: false, message: 'Add-on ID is required.' });
        }

        const addon = await Addon.findByIdAndUpdate(addonId, { status: status }, { new: true });

        if (!addon) {
            return res.status(500).json({ success: false, message: 'Error occured while updating add-on' });
        }

        return res.status(200).json({ success: true, message: 'Add-on availability updated', data: addon });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Add-on updation failed' });
    }
}

const deleteAddon = async (req, res) => {
    try {
        const { addonId } = req.params;

        if (!addonId) {
            return res.status(400).json({ success: false, message: 'Add-on ID needed to delete' });
        }

        const addon = await Addon.findByIdAndDelete(addonId);

        if (!addon) {
            return res.status(500).json({ success: false, message: 'No add-on found' });
        }

        return res.status(200).json({ success: true, message: 'Addon deleted' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Deletion failed' });
    }
}

const getAnAddon = async (req, res) => {
    try {
        const { addonId } = req.params;

        if (!addonId) {
            return res.status(400).json({ success: false, message: 'Add-on Id is needed' });
        }

        const addon = await Addon.findById(addonId);

        if (!addon) {
            return res.status(404).json({ success: false, message: 'No add-on found' });
        }

        return res.status(200).json({ success: true, message: 'Add-on found', data: addon });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to get Addon' });
    }
}

const editAddon = async (req, res) => {
    try {
        const { title, description, price, order, status = true, isDocumentRequired } = req.body;

        const { addonId } = req.params;

        if (!title || !description || !price) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const addon = await Addon.findByIdAndUpdate(addonId, { title, description, price, order, status, isDocumentRequired });

        if (!addon) {
            return res.status(500).json({ success: false, message: 'Error occured while updating add-on' });
        }

        return res.status(200).json({ success: true, message: 'Add-on updated' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Addon updation failed' });
    }
}

export {
    createAddon,
    getAllAddons,
    updateAvailability,
    deleteAddon,
    getAnAddon,
    editAddon,
}