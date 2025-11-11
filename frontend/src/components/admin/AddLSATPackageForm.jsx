// components/AddLSATPackageForm.jsx
import { useFieldArray, useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import useRefreshToken from "../../hooks/useRefreshToken";
import { updateUser } from "../../features/forms/UserAuthSlice.js";
import { useNavigate } from "react-router";
import { useState } from "react";
import { BookOpen, Clock, DollarSign, Users, HelpCircle } from "lucide-react";

function AddLSATPackageForm({ lsatPackage }) {
    const user = useSelector(state => state.user.user);
    const refreshAccessToken = useRefreshToken();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isPublishing, setIsPublishing] = useState(false);

    const { register, handleSubmit, formState: { errors }, control, reset, watch } = useForm({
        defaultValues: {
            title: lsatPackage?.title || "",
            description: lsatPackage?.description || "",
            sessions: lsatPackage?.sessions || 1,
            price: lsatPackage?.price || "",
            originalPrice: lsatPackage?.originalPrice || "",
            duration: lsatPackage?.duration || "6 months",
            features: lsatPackage?.features || ["1-hour personalized LSAT session", "Expert LSAT tutor", "Flexible scheduling"],
            isActive: lsatPackage?.isActive !== undefined ? lsatPackage.isActive : true
        }
    });

    const publishLSATPackage = async (packageData) => {
        try {
            setIsPublishing(true);
            
            // Calculate discount if original price is provided
            let discount = 0;
            if (packageData.originalPrice && packageData.originalPrice > packageData.price) {
                discount = Math.round(((packageData.originalPrice - packageData.price) / packageData.originalPrice) * 100);
            }

            const { data } = await axios.post(
                `${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-packages/create`, 
                { 
                    title: packageData.title,
                    description: packageData.description,
                    sessions: parseInt(packageData.sessions),
                    price: parseFloat(packageData.price),
                    originalPrice: packageData.originalPrice ? parseFloat(packageData.originalPrice) : null,
                    discount: discount,
                    duration: packageData.duration,
                    features: packageData.features.filter(feature => feature.trim() !== ''),
                    isActive: packageData.isActive
                }, 
                { 
                    headers: { 
                        Authorization: `Bearer ${user.accessToken}` 
                    } 
                }
            );

            if (data && data.success) {
                toast.success(data.message);
                setIsPublishing(false);
                reset();
                navigate('/admin/lsat-packages');
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    let discount = 0;
                    if (packageData.originalPrice && packageData.originalPrice > packageData.price) {
                        discount = Math.round(((packageData.originalPrice - packageData.price) / packageData.originalPrice) * 100);
                    }

                    const { data } = await axios.post(
                        `${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-packages/create`, 
                        { 
                            title: packageData.title,
                            description: packageData.description,
                            sessions: parseInt(packageData.sessions),
                            price: parseFloat(packageData.price),
                            originalPrice: packageData.originalPrice ? parseFloat(packageData.originalPrice) : null,
                            discount: discount,
                            duration: packageData.duration,
                            features: packageData.features.filter(feature => feature.trim() !== ''),
                            isActive: packageData.isActive
                        }, 
                        { 
                            headers: { 
                                Authorization: `Bearer ${newAccessToken}` 
                            } 
                        }
                    );

                    if (data && data.success) {
                        toast.success(data.message);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                        reset();
                        setIsPublishing(false);
                        navigate('/admin/lsat-packages');
                    }
                } catch (error) {
                    const message = error?.response?.data?.message;
                    toast.error(message);
                    setIsPublishing(false);
                }
            } else {
                toast.error(message || 'Failed to create package');
                setIsPublishing(false);
            }
        }
    }

    const editLSATPackage = async (packageData) => {
        try {
            setIsPublishing(true);

            let discount = 0;
            if (packageData.originalPrice && packageData.originalPrice > packageData.price) {
                discount = Math.round(((packageData.originalPrice - packageData.price) / packageData.originalPrice) * 100);
            }

            const { data } = await axios.put(
                `${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-packages/edit/${lsatPackage._id}`, 
                { 
                    title: packageData.title,
                    description: packageData.description,
                    sessions: parseInt(packageData.sessions),
                    price: parseFloat(packageData.price),
                    originalPrice: packageData.originalPrice ? parseFloat(packageData.originalPrice) : null,
                    discount: discount,
                    duration: packageData.duration,
                    features: packageData.features.filter(feature => feature.trim() !== ''),
                    isActive: packageData.isActive
                }, 
                { 
                    headers: { 
                        Authorization: `Bearer ${user.accessToken}` 
                    } 
                }
            );

            if (data && data.success) {
                toast.success(data.message);
                navigate('/admin/lsat-packages');
                setIsPublishing(false);
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    let discount = 0;
                    if (packageData.originalPrice && packageData.originalPrice > packageData.price) {
                        discount = Math.round(((packageData.originalPrice - packageData.price) / packageData.originalPrice) * 100);
                    }

                    const { data } = await axios.put(
                        `${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-packages/edit/${lsatPackage._id}`, 
                        { 
                            title: packageData.title,
                            description: packageData.description,
                            sessions: parseInt(packageData.sessions),
                            price: parseFloat(packageData.price),
                            originalPrice: packageData.originalPrice ? parseFloat(packageData.originalPrice) : null,
                            discount: discount,
                            duration: packageData.duration,
                            features: packageData.features.filter(feature => feature.trim() !== ''),
                            isActive: packageData.isActive
                        }, 
                        { 
                            headers: { 
                                Authorization: `Bearer ${newAccessToken}` 
                            } 
                        }
                    );

                    if (data && data.success) {
                        toast.success(data.message);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                        setIsPublishing(false);
                        navigate('/admin/lsat-packages');
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

    const { append: appendFeature, remove: removeFeature, fields: featureFields } = useFieldArray({
        control,
        name: 'features'
    });

    const addFeatureHandler = () => {
        try {
            appendFeature('');
        } catch (error) {
            console.error(error);
        }
    }

    // Calculate price per session
    const sessions = watch('sessions');
    const price = watch('price');
    const pricePerSession = price && sessions ? (price / sessions).toFixed(2) : 0;

    return (
        <form onSubmit={lsatPackage ? handleSubmit(editLSATPackage) : handleSubmit(publishLSATPackage)}>
            <div className="w-full grid grid-cols-1 md:grid-cols-6 gap-10 items-start">
                <div className="border-2 border-blue-100 rounded-xl col-span-1 p-3 md:p-10 md:col-span-4 lg:col-span-4 bg-blue-50">
                    {/* Package Title */}
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700 flex items-center gap-2" htmlFor="title">
                            <BookOpen size={18} />
                            Package Title: *
                        </label>
                        <input 
                            className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" 
                            id="title" 
                            type="text" 
                            {...register('title', { required: true })} 
                            placeholder="e.g., 5-Session LSAT Tutoring Package" 
                        />
                        {errors.title && <p className="text-sm text-orange-500 font-light">Title is required.</p>}
                    </div>

                    <br />

                    {/* Package Description */}
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="description">Description: *</label>
                        <textarea 
                            rows={4} 
                            className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" 
                            id="description" 
                            {...register('description', { required: true })} 
                            placeholder="Describe what this package offers to students..." 
                        />
                        {errors.description && <p className="text-sm text-orange-500 font-light">Description is required.</p>}
                    </div>

                    <br />

                    {/* Sessions and Pricing */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Sessions */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700 flex items-center gap-2" htmlFor="sessions">
                                <Users size={18} />
                                Sessions: *
                            </label>
                            <select 
                                className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full cursor-pointer" 
                                id="sessions" 
                                {...register('sessions', { required: true })}
                            >
                                <option value={1}>1 Session</option>
                                <option value={5}>5 Sessions</option>
                                <option value={10}>10 Sessions</option>
                            </select>
                            {errors.sessions && <p className="text-sm text-orange-500 font-light">Sessions are required.</p>}
                        </div>

                        {/* Price */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700 flex items-center gap-2" htmlFor="price">
                                <DollarSign size={18} />
                                Price ($): *
                            </label>
                            <input 
                                className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" 
                                id="price" 
                                type="number" 
                                step="0.01"
                                {...register('price', { required: true, min: 1 })} 
                                placeholder="99.00" 
                            />
                            {errors.price && <p className="text-sm text-orange-500 font-light">Valid price is required.</p>}
                            {pricePerSession > 0 && (
                                <p className="text-sm text-green-600">${pricePerSession} per session</p>
                            )}
                        </div>

                        {/* Original Price (for discounts) */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700" htmlFor="originalPrice">Original Price ($):</label>
                            <input 
                                className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" 
                                id="originalPrice" 
                                type="number" 
                                step="0.01"
                                {...register('originalPrice', { min: 0 })} 
                                placeholder="119.00 (optional)" 
                            />
                            <p className="text-sm text-gray-500">Leave empty if no discount</p>
                        </div>
                    </div>

                    <br />

                    {/* Duration */}
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700 flex items-center gap-2" htmlFor="duration">
                            <Clock size={18} />
                            Package Duration: *
                        </label>
                        <select 
                            className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full cursor-pointer" 
                            id="duration" 
                            {...register('duration', { required: true })}
                        >
                            <option value="3 months">3 Months</option>
                            <option value="6 months">6 Months</option>
                            <option value="12 months">12 Months</option>
                        </select>
                        {errors.duration && <p className="text-sm text-orange-500 font-light">Duration is required.</p>}
                    </div>

                    <br />

                    {/* Features */}
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="features">Package Features: *</label>
                        <p className="text-sm text-gray-500 mb-2">List what's included in this package</p>
                        {featureFields.map((field, index) => (
                            <div key={field.id} className="flex gap-2 items-center flex-wrap">
                                <input 
                                    className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 grow max-w-full" 
                                    type="text" 
                                    {...register(`features.${index}`, { required: index === 0 })} 
                                    placeholder="e.g., 1-hour personalized LSAT session" 
                                />
                                <button 
                                    type="button" 
                                    className="bg-red-500 cursor-pointer text-white rounded-md py-2 px-3" 
                                    onClick={() => removeFeature(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        {errors.features && <p className="text-sm text-orange-500 font-light">At least one feature is required.</p>}
                    </div>

                    <div className="mt-3">
                        <button 
                            type="button" 
                            onClick={addFeatureHandler} 
                            className="bg-blue-600 cursor-pointer text-white rounded-md py-2 px-5"
                        >
                            Add Feature
                        </button>
                    </div>

                    <br />

                    {/* Status */}
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="isActive">Status: *</label>
                        <select 
                            className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 cursor-pointer w-full" 
                            id="isActive" 
                            {...register('isActive', { required: true })}
                        >
                            <option value={true}>Active</option>
                            <option value={false}>Inactive</option>
                        </select>
                        {errors.isActive && <p className="text-sm text-orange-500 font-light">Status is required.</p>}
                    </div>

                    <br />

                    {/* Submit Button */}
                    <button 
                        className="p-2 w-full rounded-md text-white bg-blue-600 cursor-pointer shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors disabled:opacity-50" 
                        type="submit"
                        disabled={isPublishing}
                    >
                        {
                            !isPublishing ? (lsatPackage ? 'Update Package' : 'Create Package') :
                                (<span className="flex space-x-1 items-center justify-center py-2">
                                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.1s]"></span>
                                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"></span>
                                </span>)
                        }
                    </button>
                </div>

                {/* Preview Section */}
                <div className="border-2 border-blue-100 rounded-xl p-6 bg-white h-fit sticky top-4 col-span-1 md:col-span-2">
                    <h3 className="text-xl font-semibold text-blue-900 mb-4">Package Preview</h3>
                    
                    <div className="space-y-3">
                        <div>
                            <span className="font-semibold">Title:</span>
                            <p className="text-gray-700">{watch('title') || 'Package Title'}</p>
                        </div>
                        
                        <div>
                            <span className="font-semibold">Sessions:</span>
                            <p className="text-gray-700">{watch('sessions') || '1'} session(s)</p>
                        </div>
                        
                        <div>
                            <span className="font-semibold">Price:</span>
                            <p className="text-gray-700">
                                ${watch('price') || '0'}
                                {watch('originalPrice') && watch('originalPrice') > watch('price') && (
                                    <span className="text-green-600 ml-2">
                                        (Save ${(watch('originalPrice') - watch('price')).toFixed(2)})
                                    </span>
                                )}
                            </p>
                        </div>
                        
                        <div>
                            <span className="font-semibold">Duration:</span>
                            <p className="text-gray-700">{watch('duration') || '6 months'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default AddLSATPackageForm;