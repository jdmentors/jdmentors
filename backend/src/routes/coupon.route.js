import { Router } from "express";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import { addCoupon, couponValidity, deleteCoupon, editCoupon, getACoupon, getAllCoupons, updateAvailability } from "../controllers/coupon.controller.js";

const couponRouter = Router();

couponRouter.post('/create', verifyAdmin, addCoupon );
couponRouter.get('/all', verifyAdmin, getAllCoupons );
couponRouter.get('/single/:couponId', getACoupon );
couponRouter.delete('/delete/:couponId', verifyAdmin, deleteCoupon );
couponRouter.patch('/availability/:couponId', verifyAdmin, updateAvailability );
couponRouter.put('/edit/:couponId', verifyAdmin, editCoupon );
couponRouter.post('/validity', couponValidity );

export default couponRouter;