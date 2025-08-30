import { useFieldArray, useForm } from "react-hook-form";
import { useCallback, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import useRefreshToken from "../../hooks/useRefreshToken";
import { updateUser } from "../../features/forms/UserAuthSlice.js";
import { useNavigate } from "react-router";
import { useState } from "react";

function AddServiceForm({ service }) {
    const user = useSelector(state => state.user.user);
    const refreshAccessToken = useRefreshToken();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isPublishing, setIsPublishing] = useState(false);

    const { register, handleSubmit, control, watch, setValue, formState: { errors }, reset, } = useForm({
        defaultValues: {
            title: service?.title || "",
            slug: service?.slug || "",
            description: service?.description || "",
            price: service?.price || "",
            process: service?.process || "",
            features: service?.features || [""],
            addons: service?.addons || [""],
            extras: service?.extras || [""],
            order: service?.order || null,
            status: service?.status || true,
        }
    });

    const publishService = async (serviceData) => {
        try {
            setIsPublishing(true);
            const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/services/create`, { title: serviceData.title, slug: serviceData.slug, description: serviceData.description, price: serviceData.price, process: serviceData.process || '', features: serviceData.features || [], addons: serviceData.addons || [], extras: serviceData.extras || [], order: serviceData.order, status: serviceData.status }, { headers: { Authorization: `Bearer ${user.accessToken}` } });

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

                    const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/services/create`, { title: serviceData.title, slug: serviceData.slug, description: serviceData.description, price: serviceData.price, process: serviceData.process || '', features: serviceData.features || [], addons: serviceData.addons || [], extras: serviceData.extras || [], order: serviceData.order, status: serviceData.status }, { headers: { Authorization: `Bearer ${newAccessToken}` } });

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

    const editService = async (serviceData) => {
        try {
            setIsPublishing(true);

            const { data } = await axios.put(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/services/edit/${service._id}`, { title: serviceData.title, slug: serviceData.slug, description: serviceData.description, price: serviceData.price, process: serviceData.process || '', features: serviceData.features || [], addons: serviceData.addons || [], extras: serviceData.extras || [], order: serviceData.order, status: serviceData.status }, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data && data.success) {
                toast.success(data.message);
                navigate('/admin/services');
                setIsPublishing(false);
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.put(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/services/edit/${service._id}`, { title: serviceData.title, slug: serviceData.slug, description: serviceData.description, price: serviceData.price, process: serviceData.process || '', features: serviceData.features || [], addons: serviceData.addons || [], extras: serviceData.extras || [], order: serviceData.order, status: serviceData.status }, { headers: { Authorization: `Bearer ${newAccessToken}` } });

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

    const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
        control,
        name: 'features'
    });

    const { fields: addonFields, append: appendAddon, remove: removeAddon } = useFieldArray({
        control,
        name: 'addons'
    });

    const { fields: extraFields, append: appendExtra, remove: removeExtra } = useFieldArray({
        control,
        name: 'extras'
    });

    const addFeatureHandler = () => {
        try {
            appendFeature("");
        } catch (error) {
            console.error(error);
        }
    }

    const addAddonHandler = () => {
        try {
            appendAddon("");
        } catch (error) {
            console.error(error);
        }
    }

    const addExtraHandler = () => {
        try {
            appendExtra("");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <form onSubmit={service ? handleSubmit(editService) : handleSubmit(publishService)}>
            <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
                <div className="border-2 border-blue-100 rounded-xl col-span-1 p-3 md:p-10 md:col-span-4 lg:col-span-3 bg-blue-50">
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="title">Title:</label>
                        <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="title" type="text" {...register('title', { required: true })} placeholder="Enter service title here..." />
                        {errors.title && <p className="text-sm text-orange-500 font-light">Title is required.</p>}
                    </div>

                    <br />

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="slug">Slug:</label>
                        <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="slug" type="text" onInput={(e) => setValue('slug', slugTransform(e.target.value), { shouldValidate: true })} {...register('slug', { required: true })} placeholder="Enter service slug here..." />
                        {errors.slug && <p className="text-sm text-orange-500 font-light">Slug is required.</p>}
                    </div>

                    <br />

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="description">Description:</label>
                        <textarea rows={6} className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="description" {...register('description', { required: true })} placeholder="Enter service description here..." />
                        {errors.description && <p className="text-sm text-orange-500 font-light">Description is required.</p>}
                    </div>

                    <br />

                    {/* Features add */}
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="features">Features:</label>
                        {
                            featureFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2 items-center flex-wrap">
                                    <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 grow max-w-full" id="features" type="text" {...register(`features.${index}`, { required: false })} placeholder="Enter service features here..." />
                                    <button type="button" className="bg-red-500 cursor-pointer text-white rounded-md py-2 px-3" onClick={() => removeFeature(index)}>Remove</button>
                                </div>
                            )
                            )
                        }
                        {errors.features && <p className="text-sm text-orange-500 font-light">Features are required.</p>}
                    </div>

                    <div className="mt-3">
                        <button type="button" onClick={addFeatureHandler} className="bg-blue-600 cursor-pointer text-white rounded-md py-2 px-5">Add a Feature</button>
                    </div>

                    <br />

                    {/* Addon add */}
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="addons">Add-ons:</label>
                        {
                            addonFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2 items-center flex-wrap">
                                    <div className="flex gap-2 flex-wrap w-full">
                                        <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 grow max-w-full" id="addons" type="text" {...register(`addons.${index}.title`, { required: false })} placeholder="Enter service addons title here..." />

                                        <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 grow max-w-full" id="addons" type="number" {...register(`addons.${index}.price`, { required: false })} placeholder="Enter service addons price here..." />

                                        <textarea className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 grow max-w-full" id="addons" {...register(`addons.${index}.description`, { required: false })} placeholder="Enter service addons description here..."></textarea>
                                    </div>
                                    <button type="button" className="bg-red-500 cursor-pointer text-white rounded-md py-2 px-3" onClick={() => removeAddon(index)}>Remove</button>
                                </div>
                            )
                            )
                        }
                        {errors.addons && <p className="text-sm text-orange-500 font-light">Add-ons are required.</p>}
                    </div>

                    <div className="mt-3">
                        <button type="button" onClick={addAddonHandler} className="bg-blue-600 cursor-pointer text-white rounded-md py-2 px-5">Add an Addon</button>
                    </div>

                    <br />

                    {/* Extras add */}
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="extras">Extras:</label>
                        {
                            extraFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2 items-center flex-wrap">
                                    <div className="flex gap-2 flex-wrap w-full">
                                        <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 grow max-w-full" id="extras" type="text" {...register(`extras.${index}.title`, { required: false })} placeholder="Enter service extras title here..." />

                                        <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 grow max-w-full" id="extras" type="number" {...register(`extras.${index}.price`, { required: false })} placeholder="Enter service extras price here..." />

                                        <textarea className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 grow max-w-full" id="extras" {...register(`extras.${index}.description`, { required: false })} placeholder="Enter service extras description here..."></textarea>
                                    </div>
                                    <button type="button" className="bg-red-500 cursor-pointer text-white rounded-md py-2 px-3" onClick={() => removeExtra(index)}>Remove</button>
                                </div>
                            )
                            )
                        }
                        {errors.extras && <p className="text-sm text-orange-500 font-light">Extras are required.</p>}
                    </div>

                    <div className="mt-3">
                        <button type="button" onClick={addExtraHandler} className="bg-blue-600 cursor-pointer text-white rounded-md py-2 px-5">Add an Extra</button>
                    </div>

                    <br />

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="process">Process:</label>
                        <textarea rows={4} className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="process" {...register('process', { required: true })} placeholder="Enter service process here..." />
                        {errors.process && <p className="text-sm text-orange-500 font-light">Process is required.</p>}
                    </div>

                    <br />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700" htmlFor="price">Price:</label>
                            <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="price" type="number" {...register('price', { required: true })} placeholder="Enter service price here..." />
                            {errors.price && <p className="text-sm text-orange-500 font-light">Price is required.</p>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700" htmlFor="order">Order:</label>
                            <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="order" type="number" {...register('order', { required: false })} placeholder="Enter service order here..." />
                            {errors.order && <p className="text-sm text-orange-500 font-light">Order is required.</p>}
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

export default AddServiceForm; 