import { useFieldArray, useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import useRefreshToken from "../../hooks/useRefreshToken";
import { updateUser } from "../../features/forms/UserAuthSlice.js";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { HelpCircle } from "lucide-react";

function AddPackageForm({ ourPackage }) {
    const user = useSelector(state => state.user.user);
    const refreshAccessToken = useRefreshToken();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isPublishing, setIsPublishing] = useState(false);

    const { register, handleSubmit, formState: { errors }, control, reset } = useForm({
        defaultValues: {
            title: ourPackage?.title || "",
            description: ourPackage?.description || "",
            price: ourPackage?.price || "",
            process: ourPackage?.process || "",
            services: ourPackage?.services || [""],
            addons: ourPackage?.addons || [""],
            extras: ourPackage?.extras || [""],
            order: ourPackage?.order || null,
            status: ourPackage?.status || true,
            isDocumentRequired: ourPackage?.isDocumentRequired || false
        }
    });

    const publishPackage = async (packageData) => {
        try {
            setIsPublishing(true);
            const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/packages/create`, { title: packageData.title, slug: packageData.slug, description: packageData.description, price: packageData.price, process: packageData.process || '', services: packageData.services || '', addons: packageData.addons || '', extras: packageData.extras || '', order: packageData.order, status: packageData.status, isDocumentRequired: packageData.isDocumentRequired }, { headers: { Authorization: `Bearer ${user.accessToken}` } });

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

                    const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/packages/create`, { title: packageData.title, slug: packageData.slug, description: packageData.description, price: packageData.price, process: packageData.process || '', services: packageData.services || '', addons: packageData.addons || '', extras: packageData.extras || '', order: packageData.order, status: packageData.status, isDocumentRequired: packageData.isDocumentRequired }, { headers: { Authorization: `Bearer ${newAccessToken}` } });

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

    const editPackage = async (packageData) => {
        try {
            setIsPublishing(true);

            const { data } = await axios.put(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/packages/edit/${ourPackage._id}`, { title: packageData.title, slug: packageData.slug, description: packageData.description, price: packageData.price, process: packageData.process || '', services: packageData.services || '', addons: packageData.addons || '', extras: packageData.extras || '', order: packageData.order, status: packageData.status, isDocumentRequired: packageData.isDocumentRequired }, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data && data.success) {
                toast.success(data.message);
                navigate('/admin/packages');
                setIsPublishing(false);
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.put(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/packages/edit/${ourPackage._id}`, { title: packageData.title, slug: packageData.slug, description: packageData.description, price: packageData.price, process: packageData.process || '', services: packageData.services || '', addons: packageData.addons || '', extras: packageData.extras || '', order: packageData.order, status: packageData.status, isDocumentRequired: packageData.isDocumentRequired }, { headers: { Authorization: `Bearer ${newAccessToken}` } });

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

    const { append: appendService, remove: removeService, fields: serviceFields } = useFieldArray({
        control,
        name: 'services',
    });

    const { fields:addonFields, append:appendAddon, remove: removeAddon } = useFieldArray({
        control,
        name: 'addons'
    });

    const { fields:extraFields, append:appendExtra, remove:removeExtra } = useFieldArray({
        control,
        name: 'extras'
    });

    const addServiceHandler = () => {
        try {
            appendService('');
        } catch (error) {
            console.error(error);
        }
    }

    const addAddonHandler = () => {
        try {
            appendAddon('');
        } catch (error) {
            console.error(error);
        }
    }

    const addExtraHandler = () => {
        try {
            appendExtra('');
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <form onSubmit={ourPackage ? handleSubmit(editPackage) : handleSubmit(publishPackage)}>
            <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
                <div className="border-2 border-blue-100 rounded-xl col-span-1 p-3 md:p-10 md:col-span-4 lg:col-span-3 bg-blue-50">
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="title">Title: *</label>
                        <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="title" type="text" {...register('title', { required: true })} placeholder="Enter package title here..." />
                        {errors.title && <p className="text-sm text-orange-500 font-light">Title is required.</p>}
                    </div>

                    <br />

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="description">Description: *</label>
                        <textarea rows={6} className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="description" {...register('description', { required: true })} placeholder="Enter package description here..." />
                        {errors.description && <p className="text-sm text-orange-500 font-light">Description is required.</p>}
                    </div>

                    <br />

                    {/* Service add */}
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="services">Services:</label>
                        {
                            serviceFields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2 items-center flex-wrap">
                                        <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 grow max-w-full" id="services" type="text" {...register(`services.${index}`, { required: false })} placeholder="Enter package services here..." />
                                        <button type="button" className="bg-red-500 cursor-pointer text-white rounded-md py-2 px-3" onClick={() => removeService(index)}>Remove</button>
                                    </div>
                                )
                            )
                        }
                        {errors.services && <p className="text-sm text-orange-500 font-light">Services are required.</p>}
                    </div>

                    <div className="mt-3">
                        <button type="button" onClick={addServiceHandler} className="bg-blue-600 cursor-pointer text-white rounded-md py-2 px-5">Add a Service</button>
                    </div>

                    <br />

                    {/* Addon Add */}
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="addons">Addons:</label>
                        {
                            addonFields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2 items-center flex-wrap">
                                        <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 grow max-w-full" id="addons" type="text" {...register(`addons.${index}`, { required: false })} placeholder="Enter package addons here..." />
                                        <button type="button" className="bg-red-500 cursor-pointer text-white rounded-md py-2 px-3" onClick={() => removeAddon(index)}>Remove</button>
                                    </div>
                                )
                            )
                        }
                        {errors.addons && <p className="text-sm text-orange-500 font-light">Addons are required.</p>}
                    </div>

                    <div className="mt-3">
                        <button type="button" onClick={addAddonHandler} className="bg-blue-600 cursor-pointer text-white rounded-md py-2 px-5">Add an Addon</button>
                    </div>

                    <br />

                    {/* Extra add */}
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="extras">Extras:</label>
                        {
                            extraFields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2 items-center flex-wrap">
                                        <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 grow max-w-full" id="extras" type="text" {...register(`extras.${index}`, { required: false })} placeholder="Enter package extras here..." />
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
                        <label className="text-gray-700" htmlFor="process">Process: *</label>
                        <textarea rows={4} className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="process" {...register('process', { required: true })} placeholder="Enter package process here..." />
                        {errors.process && <p className="text-sm text-orange-500 font-light">Process is required.</p>}
                    </div>

                    <br />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700" htmlFor="price">Price: *</label>
                            <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="price" type="number" {...register('price', { required: true })} placeholder="Enter package price here..." />
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

                    <label className="flex items-center gap-2">
                        <HelpCircle className="text-blue-600" size={18} />
                        <input type="checkbox" {...register('isDocumentRequired', {required: false})}/>
                        <span >Is document upload required?</span>
                    </label>

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

export default AddPackageForm;