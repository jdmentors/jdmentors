// controllers/package.controller.js
import Package from "../models/package.model.js";
import PackagePurchase from "../models/lsatpackagepurchase.model.js";
import User from "../models/user.model.js";
import LsatPackage from "../models/lsatpackage.model.js";

// Get all active packages
const getAllPackages = async (req, res) => {
    try {
        const packages = await LsatPackage.find({ isActive: true }).sort({ sessions: 1 });

        if (!packages || packages.length === 0) {
            return res.status(404).json({ success: false, message: 'No packages found' });
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Packages found', 
            data: packages 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to get packages',
            error: error.message 
        });
    }
}

const getActiveLSATPackages = async (req, res) => {
    try {
        const packages = await LsatPackage.find({ isActive: true }).sort({ sessions: 1 });

        return res.status(200).json({ 
            success: true, 
            message: 'Active LSAT packages found', 
            data: packages 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to get active LSAT packages',
            error: error.message 
        });
    }
}

const getLSATPackage = async (req, res) => {
    try {
        const { packageId } = req.params;

        const lsatPackage = await LsatPackage.findById(packageId);

        if (!lsatPackage) {
            return res.status(404).json({ 
                success: false, 
                message: 'LSAT package not found' 
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: 'LSAT package found', 
            data: lsatPackage 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to get LSAT package',
            error: error.message 
        });
    }
}

// Create package purchase
const createPackagePurchase = async (req, res) => {
    try {
        const { packageId, userEmail, userName, userPhone, stripePaymentIntentId } = req.body;

        const lsatPackage = await LsatPackage.findById(packageId);
        if (!lsatPackage) {
            return res.status(404).json({ success: false, message: 'Package not found' });
        }

        // Check if user exists (for registered users)
        let user = null;
        if (req.user) {
            user = req.user._id;
        } else {
            // For guest purchases, check if email exists in users
            const existingUser = await User.findOne({ email: userEmail });
            if (existingUser) {
                user = existingUser._id;
            }
        }

        // Calculate expiration date (6 months from now)
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 6);

        const packagePurchase = await PackagePurchase.create({
            package: packageId,
            user: user,
            userEmail,
            userName,
            userPhone,
            sessionsPurchased: lsatPackage.sessions,
            sessionsRemaining: lsatPackage.sessions,
            price: lsatPackage.price,
            stripePaymentIntentId,
            expiresAt
        });

        return res.status(201).json({ 
            success: true, 
            message: 'Package purchase created successfully', 
            data: packagePurchase 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to create package purchase',
            error: error.message 
        });
    }
}

// Get user's active packages
const getUserPackages = async (req, res) => {
    try {
        const { email } = req.params;

        const packages = await PackagePurchase.find({ 
            userEmail: email,
            status: 'active',
            sessionsRemaining: { $gt: 0 },
            expiresAt: { $gt: new Date() }
        }).populate('package');

        return res.status(200).json({ 
            success: true, 
            message: 'User packages found', 
            data: packages 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to get user packages',
            error: error.message 
        });
    }
}

// Use a session from package
const usePackageSession = async (req, res) => {
    try {
        const { purchaseId, userEmail } = req.body;

        const packagePurchase = await PackagePurchase.findOne({
            _id: purchaseId,
            userEmail: userEmail,
            status: 'active',
            sessionsRemaining: { $gt: 0 },
            expiresAt: { $gt: new Date() }
        });

        if (!packagePurchase) {
            return res.status(404).json({ 
                success: false, 
                message: 'No valid package found' 
            });
        }

        packagePurchase.sessionsRemaining -= 1;
        
        // Update status if no sessions left
        if (packagePurchase.sessionsRemaining === 0) {
            packagePurchase.status = 'completed';
        }

        await packagePurchase.save();

        return res.status(200).json({ 
            success: true, 
            message: 'Session used successfully', 
            data: {
                sessionsRemaining: packagePurchase.sessionsRemaining,
                status: packagePurchase.status
            }
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to use session',
            error: error.message 
        });
    }
}

const confirmPackagePurchase = async (req, res) => {
  try {
    const { purchaseId, stripeSessionId } = req.body;

    const packagePurchase = await PackagePurchase.findByIdAndUpdate(
      purchaseId,
      {
        status: 'active',
        stripePaymentIntentId: stripeSessionId
      },
      { new: true }
    ).populate('package');

    if (!packagePurchase) {
      return res.status(404).json({ 
        success: false, 
        message: 'Package purchase not found' 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Package purchase confirmed', 
      data: packagePurchase 
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to confirm package purchase',
      error: error.message 
    });
  }
}

const getPackagePurchase = async (req, res) => {
  try {
    const { purchaseId } = req.params;

    const purchase = await PackagePurchase.findById(purchaseId)
      .populate('package');

    if (!purchase) {
      return res.status(404).json({ 
        success: false, 
        message: 'Purchase not found' 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Purchase found', 
      data: purchase 
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to get purchase',
      error: error.message 
    });
  }
}

const createLSATPackage = async (req, res) => {
    try {
        const { title, description, sessions, price, originalPrice, discount, duration, features, isActive } = req.body;

        if (!title || !description || !sessions || !price || !duration || !features || features.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'All required fields must be filled' 
            });
        }

        const newPackage = await LsatPackage.create({
            title,
            description,
            sessions,
            price,
            originalPrice,
            discount,
            duration,
            features,
            isActive
        });

        return res.status(201).json({ 
            success: true, 
            message: 'LSAT package created successfully', 
            data: newPackage 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to create LSAT package',
            error: error.message 
        });
    }
}

const updateLSATPackage = async (req, res) => {
    try {
        const { packageId } = req.params;
        const updateData = req.body;

        const updatedPackage = await LsatPackage.findByIdAndUpdate(
            packageId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedPackage) {
            return res.status(404).json({ 
                success: false, 
                message: 'LSAT package not found' 
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: 'LSAT package updated successfully', 
            data: updatedPackage 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to update LSAT package',
            error: error.message 
        });
    }
}

const deleteLSATPackage = async (req, res) => {
    try {
        const { packageId } = req.params;

        const deletedPackage = await LsatPackage.findByIdAndDelete(packageId);

        if (!deletedPackage) {
            return res.status(404).json({ 
                success: false, 
                message: 'LSAT package not found' 
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: 'LSAT package deleted successfully' 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to delete LSAT package',
            error: error.message 
        });
    }
}

const updateLSATPackageAvailability = async (req, res) => {
    try {
        const { packageId } = req.params;
        const { isActive } = req.body;

        const updatedPackage = await LsatPackage.findByIdAndUpdate(
            packageId,
            { isActive },
            { new: true }
        );

        if (!updatedPackage) {
            return res.status(404).json({ 
                success: false, 
                message: 'LSAT package not found' 
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: `Package ${isActive ? 'activated' : 'deactivated'} successfully`, 
            data: updatedPackage 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to update package availability',
            error: error.message 
        });
    }
}

export {
    getAllPackages,
    getLSATPackage,
    createPackagePurchase,
    getUserPackages,
    usePackageSession,
    confirmPackagePurchase,
    getPackagePurchase,
    createLSATPackage,
    getActiveLSATPackages,
    updateLSATPackage,
    deleteLSATPackage,
    updateLSATPackageAvailability,
}