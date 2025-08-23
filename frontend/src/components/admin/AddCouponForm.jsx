import { useForm } from "react-hook-form";
import { useCallback, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import useRefreshToken from "../../hooks/useRefreshToken";
import { updateUser } from "../../features/forms/UserAuthSlice.js";
import { useNavigate } from "react-router";
import { useState } from "react";

function AddCouponForm({ coupon }) {
    const user = useSelector(state => state.user.user);
    const refreshAccessToken = useRefreshToken();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isPublishing, setIsPublishing] = useState(false);

    const { register, handleSubmit, control, watch, setValue, formState: { errors }, reset } = useForm({
        defaultValues: {
            coupon: coupon?.coupon || "",
            usage: coupon?.usage || "",
            expiration: coupon?.expiration || "",
            discount: coupon?.discount || "",
            status: coupon?.status || true,
        }
    });

    const publishCoupon = async (couponData) => {
        try {
            setIsPublishing(true);
            const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/coupons/create`, { title: couponData.title, slug: couponData.slug, description: couponData.description, price: couponData.price, process: couponData.process || '', features: couponData.features || '', status: couponData.status }, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data && data.success) {
                toast.success(data.message);
                setIsPublishing(false);
                reset();
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/coupons/create`, { title: couponData.title, slug: couponData.slug, description: couponData.description, price: couponData.price, process: couponData.process || '', features: couponData.features || '', status: couponData.status }, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        toast.success(data.message);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                        reset();
                        setIsPublishing(false);
                    }
                } catch (error) {
                    const message = error?.response?.data?.message;
                    toast.error(message);
                    setIsPublishing(false);
                }
            } else {
                toast.error(message);
                setIsPublishing(false);
            }
        }
    }

    const editCoupon = async (couponData) => {
        try {
            setIsPublishing(true);

            const { data } = await axios.put(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/coupons/edit/${coupon._id}`, { title: couponData.title, slug: couponData.slug, description: couponData.description, price: couponData.price, process: couponData.process || '', features: couponData.features || '', status: couponData.status }, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data && data.success) {
                toast.success(data.message);
                navigate('/admin/coupons');
                setIsPublishing(false);
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.put(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/coupons/edit/${coupon._id}`, { title: couponData.title, slug: couponData.slug, description: couponData.description, price: couponData.price, process: couponData.process || '', features: couponData.features || '', status: couponData.status }, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        toast.success(data.message);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                        setIsPublishing(false);
                    }
                } catch (error) {
                    const message = error?.response?.data?.message;
                    toast.error(message);
                    setIsPublishing(false);
                }
            } else {
                toast.error(message);
                setIsPublishing(false);
            }
        }
    }

    return (
        <form onSubmit={coupon ? handleSubmit(editCoupon) : handleSubmit(publishCoupon)}>
            <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
                <div className="border-2 border-blue-100 rounded-xl col-span-1 p-3 md:p-10 md:col-span-3 bg-blue-50">
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="coupon">Coupon coupon:</label>
                        <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="coupon" type="text" {...register('coupon', { required: true })} placeholder="Enter coupon coupon here..." />
                        {errors.coupon && <p className="text-sm text-orange-500 font-light">Coupon coupon is required.</p>}
                    </div>

                    <br />

                    <div className="grid grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700" htmlFor="usage">Usage Limit:</label>
                            <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="usage" type="number" {...register('usage', { required: false })} placeholder="Enter coupon usage here..." />
                            {errors.usage && <p className="text-sm text-orange-500 font-light">Usage Limit is required.</p>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700" htmlFor="expiration">Expiration:</label>
                            <input type="date" className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="expiration" {...register('expiration', { required: false })} placeholder="Enter coupon expiration here..." />
                            {errors.expiration && <p className="text-sm text-orange-500 font-light">Expiration is required.</p>}
                        </div>
                    </div>

                    <br />

                    <div className="grid grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700" htmlFor="discount">Discount Value (%):</label>
                            <input type="number" className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="discount" {...register('discount', { required: true })} placeholder="Enter coupon discount here..." />
                            {errors.discount && <p className="text-sm text-orange-500 font-light">Discount Value is required.</p>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700" htmlFor="status">Status:</label>
                            <select className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 cursor-pointer w-full" id="status" {...register('status', { required: true })}>
                                <option value={true}>Active</option>
                                <option value={false}>Inactive</option>
                            </select>
                            {errors.status && <p className="text-sm text-orange-500 font-light">Status is required.</p>}
                        </div>
                    </div>

                    <br />

                    <button className="p-2 w-full rounded-md text-white bg-blue-600 cursor-pointer shadow-lg shadow-blue-200" type="submit">
                        {
                            !isPublishing ? 'Publish' :
                                (<span className="flex space-x-1 items-center justify-center py-2">
                                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.1s]"></span>
                                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"></span>
                                </span>)
                        }
                    </button>
                </div>
            </div>
        </form>
    );
}

export default AddCouponForm; 