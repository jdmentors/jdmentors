import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import useRefreshToken from "../../hooks/useRefreshToken";
import { updateUser } from "../../features/forms/UserAuthSlice.js";
import { useNavigate } from "react-router";
import { useState } from "react";

function AddExtraForm({ extra }) {
    const user = useSelector(state => state.user.user);
    const refreshAccessToken = useRefreshToken();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isPublishing, setIsPublishing] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            title: extra?.title || "",
            description: extra?.description || "",
            price: extra?.price || "",
            order: extra?.order || null,
            status: extra?.status || true,
        }
    });

    const publishExtra = async (extraData) => {
        try {
            setIsPublishing(true);
            const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/extras/create`, { title: extraData.title, description: extraData.description, price: extraData.price, order: extraData.order, status: extraData.status }, { headers: { Authorization: `Bearer ${user.accessToken}` } });

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

                    const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/extras/create`, { title: extraData.title, description: extraData.description, price: extraData.price, order: extraData.order, status: extraData.status }, { headers: { Authorization: `Bearer ${newAccessToken}` } });

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
            }else{
                toast.error(message);
                setIsPublishing(false);
            }
        }
    }

    const editExtra = async (extraData) => {
        try {
            setIsPublishing(true);

            const { data } = await axios.put(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/extras/edit/${extra._id}`, { title: extraData.title, description: extraData.description, price: extraData.price, order: extraData.order, status: extraData.status }, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data && data.success) {
                toast.success(data.message);
                navigate('/admin/extras');
                setIsPublishing(false);
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.put(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/extras/edit/${extra._id}`, { title: extraData.title, description: extraData.description, price: extraData.price, order: extraData.order, status: extraData.status }, { headers: { Authorization: `Bearer ${newAccessToken}` } });

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
            }else{
                toast.error(message);
                setIsPublishing(false);
            }
        }
    }

    return (
        <form onSubmit={extra ? handleSubmit(editExtra) : handleSubmit(publishExtra)}>
            <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
                <div className="border-2 border-blue-100 rounded-xl col-span-1 p-3 md:p-10 md:col-span-4 lg:col-span-3 bg-blue-50">
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="title">Title: *</label>
                        <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="title" type="text" {...register('title', { required: true })} placeholder="Enter extra title here..." />
                        {errors.title && <p className="text-sm text-orange-500 font-light">Title is required.</p>}
                    </div>

                    <br />

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="description">Description: *</label>
                        <textarea rows={6} className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="description" {...register('description', { required: true })} placeholder="Enter extra description here..." />
                        {errors.description && <p className="text-sm text-orange-500 font-light">Description is required.</p>}
                    </div>

                    <br />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700" htmlFor="price">Price: *</label>
                            <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="price" type="number" {...register('price', { required: true })} placeholder="Enter extra price here..." />
                            {errors.price && <p className="text-sm text-orange-500 font-light">Price is required.</p>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700" htmlFor="order">Order:</label>
                            <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="order" type="number" {...register('order', { required: false })} placeholder="Enter service order here..." />
                            {errors.order && <p className="text-sm text-orange-500 font-light">Order is required.</p>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700" htmlFor="status">Status: *</label>
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

export default AddExtraForm; 