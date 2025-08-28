import Extra from "../models/extra.model.js";

const createExtra = async (req, res) => {
    try {
        const { title, description, price, status = true } = req.body;

        const user = req.user;

        if (!title || !description || !price) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        if (!user) {
            return res.status(401).json({ success: false, message: 'Could not verify admin' });
        }

        const extraExists = await Extra.findOne({ title });

        if (extraExists) {
            return res.status(400).json({ success: false, message: 'Extra already exists with this title' });
        }

        const extra = await Extra.create({ title, description, price, status, user: user._id });

        if (!extra) {
            return res.status(500).json({ success: false, message: 'Error occured while creating Extra' });
        }

        return res.status(200).json({ success: true, message: 'Extra created' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Extra creation failed' });
    }
}

const getAllExtras = async (req, res) => {
    try {
        const allExtras = await Extra.aggregate([
            {
                $lookup: {
                    from: 'sessions',
                    let: { extraId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$service', '$$extraId'] }
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

        if (!allExtras) {
            return res.status(404).json({ success: false, message: 'No extras found' });
        }

        return res.status(200).json({ success: true, message: 'Extras found', data: allExtras });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to get extras' });
    }
}

const updateAvailability = async (req, res) => {
    try {
        const { status } = req.body;

        const { extraId } = req.params;

        if (!extraId) {
            return res.status(400).json({ success: false, message: 'Extra ID is required.' });
        }

        const extra = await Extra.findByIdAndUpdate(extraId, { status: status }, { new: true });

        if (!extra) {
            return res.status(500).json({ success: false, message: 'Error occured while updating extra' });
        }

        return res.status(200).json({ success: true, message: 'Extra availability updated', data: extra });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Extra updation failed' });
    }
}

const getAnExtra = async (req, res) => {
    try {
        const { extraId } = req.params;

        if (!extraId) {
            return res.status(400).json({ success: false, message: 'Extra Id is needed' });
        }

        const extra = await Extra.findById(extraId);

        if (!extra) {
            return res.status(404).json({ success: false, message: 'No extra found' });
        }

        return res.status(200).json({ success: true, message: 'Extra found', data: extra });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to get extra' });
    }
}

const editExtra = async (req, res) => {
    try {
        const { title, description, price, status = true } = req.body;

        const { extraId } = req.params;

        if (!title || !description || !price) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const extra = await Extra.findByIdAndUpdate(extraId, { title, description, price, status });

        if (!extra) {
            return res.status(500).json({ success: false, message: 'Error occured while updating extra' });
        }

        return res.status(200).json({ success: true, message: 'Extra updated' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Extra updation failed' });
    }
}

const deleteExtra = async (req, res) => {
    try {
        const { extraId } = req.params;

        if (!extraId) {
            return res.status(400).json({ success: false, message: 'Extra ID needed to delete' });
        }

        const extra = await Extra.findByIdAndDelete(extraId);

        if (!extra) {
            return res.status(500).json({ success: false, message: 'No extra found' });
        }

        return res.status(200).json({ success: true, message: 'Extra deleted' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Deletion failed' });
    }
}

export {
    createExtra,
    getAllExtras,
    updateAvailability,
    deleteExtra,
    getAnExtra,
    editExtra,
}