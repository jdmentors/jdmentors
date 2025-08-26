import Package from "../models/package.model.js";

const createPackage = async (req, res) => {
    try {
        const { title, description, process = '', services=[], addons=[], extras=[], price, status } = req.body;

        const user = req.user;

        if (!title || !description || !price) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const packageExists = await Package.findOne({ title });

        if (packageExists) {
            return res.status(400).json({ success: false, message: 'Package already exists with this title' });
        }

        const ourPackage = await Package.create({ title, description, process, services, addons, extras, price, status, user: user._id });

        if (!ourPackage) {
            return res.status(500).json({ success: false, message: 'Error occured while creating package' });
        }

        return res.status(200).json({ success: true, message: 'Package created' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const getAllPackages = async (req, res) => {
    try {
        const allPackages = await Package.aggregate([
            {
                $lookup: {
                    from: 'sessions',
                    localField: '_id',
                    foreignField: 'service',
                    as: 'sessions'
                }
            },
            {
                $unwind: {
                    path: '$sessions',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$_id',
                    title: { $first: '$title' },
                    description: { $first: '$description' },
                    services: { $first: '$services' },
                    addons: { $first: '$addons' },
                    extras: { $first: '$extras' },
                    process: { $first: '$process' },
                    price: { $first: '$price' },
                    status: { $first: '$status' },
                    createdAt: { $first: '$createdAt' },
                    sessionCount: { $sum: { $cond: [{ $ifNull: ["$sessions", false] }, 1, 0] } }
                }
            }
        ]);


        if (!allPackages) {
            return res.status(404).json({ success: false, message: 'No packages found' });
        }

        return res.status(200).json({ success: true, message: 'Packages found', data: allPackages });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to get packages' });
    }
}

const updateAvailability = async (req, res) => {
    try {
        const { status } = req.body;

        const { packageId } = req.params;

        if (!packageId) {
            return res.status(400).json({ success: false, message: 'Package ID is required.' });
        }

        const ourPackage = await Package.findByIdAndUpdate(packageId, { status: status }, { new: true });

        if (!ourPackage) {
            return res.status(500).json({ success: false, message: 'Error occured while updating package' });
        }

        return res.status(200).json({ success: true, message: 'package availability updated', data: ourPackage });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'package updation failed' });
    }
}

const editPackage = async (req, res) => {
    try {
        const { title, description, process = '', services=[], addons=[], extras=[], price, status } = req.body;

        const { packageId } = req.params;

        if (!title || !description || !price) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const ourPackage = await Package.findByIdAndUpdate(packageId, { title, description, process, services, addons, extras, price, status });

        if (!ourPackage) {
            return res.status(500).json({ success: false, message: 'Error occured while updating package' });
        }

        return res.status(200).json({ success: true, message: 'package updated' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'package updation failed' });
    }
}

const getAPackage = async (req, res) => {
    try {
        const { packageId } = req.params;

        if (!packageId) {
            return res.status(400).json({ success: false, message: 'Package Id is needed' });
        }

        const ourPackage = await Package.findById(packageId);

        if (!ourPackage) {
            return res.status(404).json({ success: false, message: 'No package found' });
        }

        return res.status(200).json({ success: true, message: 'package found', data: ourPackage });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to get package' });
    }
}

const deletePackage = async (req, res) => {
    try {
        const { packageId } = req.params;

        if (!packageId) {
            return res.status(400).json({ success: false, message: 'Package ID needed to delete' });
        }

        const ourPackage = await Package.findByIdAndDelete(packageId);

        if (!ourPackage) {
            return res.status(500).json({ success: false, message: 'No package found' });
        }

        return res.status(200).json({ success: true, message: 'Package deleted' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Deletion failed' });
    }
}

export {
    createPackage,
    getAllPackages,
    updateAvailability,
    editPackage,
    getAPackage,
    deletePackage,
}