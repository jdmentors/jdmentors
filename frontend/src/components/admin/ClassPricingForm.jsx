import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import useRefreshToken from "../../hooks/useRefreshToken";
import { updateUser } from "../../features/forms/UserAuthSlice.js";
import { useState, useEffect } from "react";
import { Users, DollarSign, Save, RotateCcw } from "lucide-react";

function ClassPricingForm() {
    const user = useSelector(state => state.user.user);
    const refreshAccessToken = useRefreshToken();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [currentPricing, setCurrentPricing] = useState(null);

    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
        defaultValues: {
            pricing: {
                2: { perPerson: 70, total: 140 },
                3: { perPerson: 65, total: 195 },
                4: { perPerson: 60, total: 240 },
                5: { perPerson: 55, total: 275 }
            }
        }
    });

    // Fetch current pricing on component mount
    useEffect(() => {
        fetchCurrentPricing();
    }, []);

    const fetchCurrentPricing = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.get(
                `${import.meta.env.VITE_DOMAIN_URL}/api/v1/others/pricing`,
                { headers: { Authorization: `Bearer ${user.accessToken}` } }
            );

            if (data && data.success) {
                setCurrentPricing(data.data);
                reset({ pricing: data.data });
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();
                    const { data } = await axios.get(
                        `${import.meta.env.VITE_DOMAIN_URL}/api/v1/others/pricing`,
                        { headers: { Authorization: `Bearer ${newAccessToken}` } }
                    );

                    if (data && data.success) {
                        setCurrentPricing(data.data);
                        reset({ pricing: data.data });
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                    }
                } catch (error) {
                    console.error('Error fetching pricing:', error);
                    toast.error('Failed to load pricing data');
                }
            } else {
                console.error('Error fetching pricing:', error);
                toast.error('Failed to load pricing data');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const updatePricing = async (formData) => {
        try {
            setIsSaving(true);
            
            // Prepare pricing data for API
            const pricingUpdates = Object.entries(formData.pricing).map(([people, prices]) => ({
                numberOfPeople: parseInt(people),
                perPerson: parseFloat(prices.perPerson),
                total: parseFloat(prices.total)
            }));

            // Send updates for each pricing tier
            const updatePromises = pricingUpdates.map(pricing => 
                axios.put(
                    `${import.meta.env.VITE_DOMAIN_URL}/api/v1/others/pricing`,
                    pricing,
                    { headers: { Authorization: `Bearer ${user.accessToken}` } }
                )
            );

            await Promise.all(updatePromises);
            toast.success('Pricing updated successfully!');
            await fetchCurrentPricing(); // Refresh data
            
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();
                    setIsSaving(true);
                    
                    const pricingUpdates = Object.entries(formData.pricing).map(([people, prices]) => ({
                        numberOfPeople: parseInt(people),
                        perPerson: parseFloat(prices.perPerson),
                        total: parseFloat(prices.total)
                    }));

                    const updatePromises = pricingUpdates.map(pricing => 
                        axios.put(
                            `${import.meta.env.VITE_DOMAIN_URL}/api/v1/others/pricing`,
                            pricing,
                            { headers: { Authorization: `Bearer ${newAccessToken}` } }
                        )
                    );

                    await Promise.all(updatePromises);
                    toast.success('Pricing updated successfully!');
                    dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                    await fetchCurrentPricing(); // Refresh data
                    
                } catch (error) {
                    const message = error?.response?.data?.message;
                    toast.error(message || 'Failed to update pricing');
                }
            } else {
                toast.error(message || 'Failed to update pricing');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const initializeDefaultPricing = async () => {
        try {
            setIsSaving(true);
            const { data } = await axios.post(
                `${import.meta.env.VITE_DOMAIN_URL}/api/v1/others/pricing/initialize`,
                {},
                { headers: { Authorization: `Bearer ${user.accessToken}` } }
            );

            if (data && data.success) {
                toast.success('Default pricing initialized!');
                await fetchCurrentPricing();
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();
                    const { data } = await axios.post(
                        `${import.meta.env.VITE_DOMAIN_URL}/api/v1/others/pricing/initialize`,
                        {},
                        { headers: { Authorization: `Bearer ${newAccessToken}` } }
                    );

                    if (data && data.success) {
                        toast.success('Default pricing initialized!');
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                        await fetchCurrentPricing();
                    }
                } catch (error) {
                    toast.error('Failed to initialize default pricing');
                }
            } else {
                toast.error('Failed to initialize default pricing');
            }
        } finally {
            setIsSaving(false);
        }
    };

    // Auto-calculate total when perPerson changes
    const handlePerPersonChange = (people, value) => {
        const perPerson = parseFloat(value) || 0;
        const total = perPerson * people;
        setValue(`pricing.${people}.total`, total.toFixed(2));
    };

    // Auto-calculate perPerson when total changes
    const handleTotalChange = (people, value) => {
        const total = parseFloat(value) || 0;
        const perPerson = total / people;
        setValue(`pricing.${people}.perPerson`, perPerson.toFixed(2));
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit(updatePricing)}>
                <div className="border-2 border-blue-100 rounded-xl p-6 bg-white">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-blue-950 flex items-center gap-2">
                                <Users className="text-blue-600" size={24} />
                                Class Session Pricing
                            </h2>
                            <p className="text-gray-600 mt-1">
                                Set pricing for different class sizes (2-5 people)
                            </p>
                        </div>
                        
                        <button
                            type="button"
                            onClick={initializeDefaultPricing}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors mt-2 sm:mt-0"
                        >
                            <RotateCcw size={16} />
                            Reset to Default
                        </button>
                    </div>

                    {/* Pricing Table */}
                    <div className="space-y-6">
                        {[2, 3, 4, 5].map(people => (
                            <div key={people} className="border border-gray-200 rounded-lg p-6 bg-blue-50">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                        <Users size={16} className="text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-blue-900">
                                        {people} People Session
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Per Person Price */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-gray-700 flex items-center gap-2">
                                            <DollarSign size={16} />
                                            Price Per Person ($): *
                                        </label>
                                        <input
                                            className="border-2 bg-white border-blue-100 rounded p-3 focus:outline-2 focus:outline-blue-200 w-full"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            {...register(`pricing.${people}.perPerson`, {
                                                required: true,
                                                min: 0,
                                                onChange: (e) => handlePerPersonChange(people, e.target.value)
                                            })}
                                            placeholder="e.g., 70.00"
                                        />
                                        {errors.pricing?.[people]?.perPerson && (
                                            <p className="text-sm text-orange-500 font-light">
                                                Valid price per person is required
                                            </p>
                                        )}
                                    </div>

                                    {/* Total Price */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-gray-700 flex items-center gap-2">
                                            <DollarSign size={16} />
                                            Total Price ($): *
                                        </label>
                                        <input
                                            className="border-2 bg-white border-blue-100 rounded p-3 focus:outline-2 focus:outline-blue-200 w-full font-semibold"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            {...register(`pricing.${people}.total`, {
                                                required: true,
                                                min: 0,
                                                onChange: (e) => handleTotalChange(people, e.target.value)
                                            })}
                                            placeholder="e.g., 140.00"
                                        />
                                        {errors.pricing?.[people]?.total && (
                                            <p className="text-sm text-orange-500 font-light">
                                                Valid total price is required
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Auto-calculation note */}
                                <div className="mt-3 text-sm text-gray-500">
                                    <p>💡 Prices are automatically calculated when you change either field</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="mt-8 p-4 bg-blue-100 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Pricing Summary</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            {[2, 3, 4, 5].map(people => {
                                const perPerson = watch(`pricing.${people}.perPerson`);
                                const total = watch(`pricing.${people}.total`);
                                return (
                                    <div key={people} className="text-center p-2 bg-white rounded">
                                        <div className="font-semibold">{people} People</div>
                                        <div className="text-blue-600">${perPerson || 0}/person</div>
                                        <div className="text-green-600 font-semibold">${total || 0} total</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Pricing
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default ClassPricingForm;