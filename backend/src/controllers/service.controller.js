import Service from "../models/service.model.js";

const createService = async (req, res) => {
    try {
        const { title, slug, description, process = '', features = [], addons = [], extras = [], price, order, status, isDocumentRequired } = req.body;

        const user = req.user;

        if (!title || !slug || !description || !price || !status) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const serviceExists = await Service.findOne({ title });

        if (serviceExists) {
            return res.status(400).json({ success: false, message: 'Service already exists with this title' });
        }

        const service = await Service.create({ title, slug, description, process, features, addons, extras, price, order, status, user: user._id, isDocumentRequired });

        if (!service) {
            return res.status(500).json({ success: false, message: 'Error occured while creating service' });
        }

        return res.status(200).json({ success: true, message: 'Service created' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Service creation failed' });
    }
}

const getAService = async (req, res) => {
    try {
        const { serviceId } = req.params;

        if (!serviceId) {
            return res.status(400).json({ success: false, message: 'Service Id is needed' });
        }

        const service = await Service.findById(serviceId);

        if (!service) {
            return res.status(404).json({ success: false, message: 'No service found' });
        }

        return res.status(200).json({ success: true, message: 'Service found', data: service });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to get service' });
    }
}

const getAllServices = async (req, res) => {
    try {
        const allServices = await Service.aggregate([
            {
                $sort: { order: 1 }
            },
            {
                $lookup: {
                    from: 'sessions',
                    let: { serviceId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$service', '$$serviceId'] }
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
                    slug: 1,
                    description: 1,
                    features: 1,
                    addons: 1,
                    extras: 1,
                    process: 1,
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


        if (!allServices) {
            return res.status(404).json({ success: false, message: 'No services found' });
        }

        return res.status(200).json({ success: true, message: 'Services found', data: allServices });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to get service' });
    }
}

const deleteService = async (req, res) => {
    try {
        const { serviceId } = req.params;

        if (!serviceId) {
            return res.status(400).json({ success: false, message: 'Service ID needed to delete' });
        }

        const service = await Service.findByIdAndDelete(serviceId);

        if (!service) {
            return res.status(500).json({ success: false, message: 'No service found' });
        }

        return res.status(200).json({ success: true, message: 'Service deleted' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Deletion failed' });
    }
}

const editService = async (req, res) => {
    try {
        const { title, slug, description, process = '', features = [], addons = [], extras = [], price, order, status, isDocumentRequired } = req.body;

        const { serviceId } = req.params;

        if (!title || !slug || !description || !price || !status) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const service = await Service.findByIdAndUpdate(serviceId, { title, slug, description, process, features, addons, extras, price, order, status, isDocumentRequired });

        if (!service) {
            return res.status(500).json({ success: false, message: 'Error occured while updating service' });
        }

        return res.status(200).json({ success: true, message: 'Service updated' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Service updation failed' });
    }
}

const updateAvailability = async (req, res) => {
    try {
        const { status } = req.body;

        const { serviceId } = req.params;

        if (!serviceId) {
            return res.status(400).json({ success: false, message: 'Service ID is required.' });
        }

        const service = await Service.findByIdAndUpdate(serviceId, { status: status }, { new: true });

        if (!service) {
            return res.status(500).json({ success: false, message: 'Error occured while updating service' });
        }

        return res.status(200).json({ success: true, message: 'Service availability updated', data: service });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Service updation failed' });
    }
}

export {
    createService,
    getAService,
    getAllServices,
    deleteService,
    editService,
    updateAvailability,
}