import Coupon from "../models/coupon.model.js";

const addCoupon = async (req, res) => {
    try {
        const { coupon, usage, expiration = null, discount, status } = req.body;

        if (!coupon || !discount) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const couponExists = await Coupon.findOne({ coupon });

        if (couponExists) {
            return res.status(400).json({ success: false, message: 'This coupon already exists' });
        }

        const currentDate = new Date();
        const providedDate = new Date(expiration);

        if (expiration && providedDate < currentDate) {
            return res.status(400).json({ success: false, message: 'You must enter a future date' });
        }

        const couponCreated = await Coupon.create({ coupon, usage, expiration, discount, status });

        if (!couponCreated) {
            return res.status(500).json({ success: false, message: 'Could not create the coupon' });
        }

        return res.status(200).json({ success: true, message: 'Coupon created', data: couponCreated });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Somer error occured while creating the coupon' })
    }
}

const getAllCoupons = async (req, res) => {
    try {
        const allCoupons = await Coupon.find();

        if (allCoupons.length < 1) {
            return res.status(200).json({ success: true, message: 'No coupon found', data: [] });
        }

        return res.status(200).json({ success: true, message: 'Coupons found', data: allCoupons });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Somer error occured while creating the coupon' })
    }
}

const deleteCoupon = async (req, res) => {
    try {
        const { couponId } = req.params;

        if (!couponId) {
            return res.status(400).json({ success: false, message: 'Coupon ID needed to delete' });
        }

        const coupon = await Coupon.findByIdAndDelete(couponId);

        if (!coupon) {
            return res.status(500).json({ success: false, message: 'No coupon found' });
        }

        return res.status(200).json({ success: true, message: 'coupon deleted' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Deletion failed' });
    }
}

const updateAvailability = async (req, res) => {
    try {
        const { status } = req.body;

        const { couponId } = req.params;

        if (!couponId) {
            return res.status(400).json({ success: false, message: 'Coupon ID is required.' });
        }

        const coupon = await Coupon.findByIdAndUpdate(couponId, { status: status }, { new: true });

        if (!coupon) {
            return res.status(500).json({ success: false, message: 'Could not update status' });
        }

        return res.status(200).json({ success: true, message: 'coupon availability updated', data: coupon });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'coupon updation failed' });
    }
}

const editCoupon = async (req, res) => {
    try {
        const { coupon, usage, expiration, discount, status } = req.body;

        const { couponId } = req.params;

        if (!coupon || !discount) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const couponUpdated = await Coupon.findByIdAndUpdate(couponId, { coupon, usage, expiration, discount, status });

        if (!couponUpdated) {
            return res.status(500).json({ success: false, message: 'Could not update coupon' });
        }

        return res.status(200).json({ success: true, message: 'coupon updated' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const getACoupon = async (req, res) => {
    try {
        const { couponId } = req.params;

        if (!couponId) {
            return res.status(400).json({ success: false, message: 'Coupon ID is needed' });
        }

        const coupon = await Coupon.findById(couponId);

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'No coupon found' });
        }

        return res.status(200).json({ success: true, message: 'coupon found', data: coupon });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to get coupon' });
    }
}

const couponValidity = async (req, res) => {
    try {
        const { coupon } = req.body;

        if(!coupon){
            return res.status(400).json({success: false, message: 'Coupon is required'});
        }

        const couponFound = await Coupon.findOne({coupon});

        if(!couponFound){
            return res.status(404).json({success: false, message: 'No coupon found'});
        }

        if(!couponFound.status){
            return res.status(403).json({success: false, message: 'Coupon is inactive'});
        }

        if(couponFound.usage && (couponFound.redeemed >= couponFound.usage)){
            return res.status(403).json({success: false, message: 'Coupon usage limit exceeded'});
        }

        if(couponFound.expiration && new Date(couponFound.expiration) < new Date()){
            return res.status(403).json({success: false, message: 'Coupon has expired'});
        }

        couponFound.redeemed = couponFound.redeemed + 1;

        couponFound.save({validateBeforeSave: false});

        return res.status(200).json({success: true, message: 'Coupon applied', data: couponFound});
    } catch (error) {
        return res.status(500).json({success: false, message: 'Could not check the availability'});
    }
}

export {
    addCoupon,
    getAllCoupons,
    deleteCoupon,
    updateAvailability,
    editCoupon,
    getACoupon,
    couponValidity,
}