import { useForm } from "react-hook-form";
import { useCallback, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import useRefreshToken from "../../hooks/useRefreshToken";
import { updateUser } from "../../features/forms/UserAuthSlice.js";
import { useNavigate } from "react-router";

function AddServiceForm({ service }) {
    const user = useSelector(state => state.user.user);
    const refreshAccessToken = useRefreshToken();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { register, handleSubmit, control, watch, setValue, getValues, reset } = useForm({
        defaultValues: {
            title: service?.title || "",
            slug: service?.slug || "",
            description: service?.description || "",
            price: service?.price || "",
            process: service?.process || "",
            features: service?.features || [],
            status: service?.status || true,
        }
    });

    const publishService = async (serviceData) => {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/services/create`, {title:serviceData.title, slug:serviceData.slug, description:serviceData.description, price:serviceData.price, process:serviceData.process || '', features:serviceData.features || '', status:serviceData.status}, {headers: {Authorization: `Bearer ${user.accessToken}`}});

            if(data && data.success){
                toast.success(data.message);
                reset();
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if(message === 'accessToken'){
                try {
                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/services/create`, {title:serviceData.title, slug:serviceData.slug, description:serviceData.description, price:serviceData.price, process:serviceData.process || '', features:serviceData.features || '', status:serviceData.status}, {headers: {Authorization: `Bearer ${newAccessToken}`}});

                    if(data && data.success){
                        toast.success(data.message);
                        dispatch(updateUser({...user, accessToken:newAccessToken}));
                        reset();
                    }
                } catch (error) {
                    toast.error(error?.response?.data?.message);
                }
            }

            if(message == 'Service already exists with this title'){
                toast.error(message);
            }
        }
    }

    const editService = async (serviceData) => {
        try {
            const { data } = await axios.put(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/services/edit/${service._id}`, {title:serviceData.title, slug:serviceData.slug, description:serviceData.description, price:serviceData.price, process:serviceData.process || '', features:serviceData.features || '', status:serviceData.status}, {headers: {Authorization: `Bearer ${user.accessToken}`}});

            if(data && data.success){
                toast.success(data.message);
                navigate('/admin/services');
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if(message === 'accessToken'){
                try {
                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.put(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/services/edit/${service._id}`, {title:serviceData.title, slug:serviceData.slug, description:serviceData.description, price:serviceData.price, process:serviceData.process || '', features:serviceData.features || '', status:serviceData.status}, {headers: {Authorization: `Bearer ${newAccessToken}`}});

                    if(data && data.success){
                        toast.success(data.message);
                        dispatch(updateUser({...user, accessToken:newAccessToken}));
                    }
                } catch (error) {
                    toast.error(error?.response?.data?.message);
                }
            }

            if(message == 'Service already exists with this title'){
                toast.error(message);
            }
        }
    }

    const slugTransform = useCallback((value) => {
        if (value && typeof value === 'string') {
            return value.trim().toLowerCase().replace(/[^a-zA-Z\d\s]+/g, "-").replace(/\s/g, "-");
        }
        return "";
    })

    useEffect(() => {
        const subscription = watch(({ title }, { name }) => {
            if (name === 'title') {
                setValue('slug', slugTransform(title), { shouldValidate: true });
            }
        })
        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={service ? handleSubmit(editService) : handleSubmit(publishService)}>
            <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
                <div className="border-2 border-blue-100 rounded-xl col-span-1 p-3 md:p-10 md:col-span-3 bg-blue-50">
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="title">Title:</label>
                        <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="title" type="text" {...register('title', { required: true })} placeholder="Enter service title here..." />
                    </div>

                    <br />

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="slug">Slug:</label>
                        <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="slug" type="text" onInput={(e) => setValue('slug', slugTransform(e.target.value), { shouldValidate: true })} {...register('slug', { required: true })} placeholder="Enter service slug here..." />
                    </div>

                    <br />

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="description">Description:</label>
                        <textarea rows={6} className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="description" {...register('description', { required: true })} placeholder="Enter service description here..." />
                    </div>

                    <br />

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="features">Features:</label>
                        <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="features" type="text" {...register(`features[0]`, { required: true })} placeholder="Enter service features here..." />
                        <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="features" type="text" {...register(`features[1]`, { required: true })} placeholder="Enter service features here..." />
                        <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="features" type="text" {...register(`features[2]`, { required: true })} placeholder="Enter service features here..." />
                    </div>

                    <br />

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="process">Process:</label>
                        <textarea rows={4} className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="process" {...register('process', { required: true })} placeholder="Enter service process here..." />
                    </div>

                    <br />

                    <div className="grid grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700" htmlFor="price">Price:</label>
                            <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="price" type="number" {...register('price', { required: true })} placeholder="Enter service price here..." />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700" htmlFor="status">Status:</label>
                            <select className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 cursor-pointer w-full" id="status" {...register('status', { required: true })}>
                                <option value={true}>Active</option>
                                <option value={false}>Inactive</option>
                            </select>
                        </div>
                    </div>

                    <br />

                    <button type="submit" className="p-2 w-full rounded-md text-white bg-blue-600 cursor-pointer shadow-lg shadow-blue-200">Publish</button>
                </div>
            </div>
        </form>
    );
}

export default AddServiceForm; 