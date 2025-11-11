import { Container } from "../components";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Mail, Phone, User, Check, LockKeyholeIcon } from "lucide-react";

function LSATPackageCheckout() {
    const { packageId } = useParams();
    const user = useSelector(state => state.user.user);
    const [lsatPackage, setLsatPackage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            fullName: user?.fullName || '',
            email: user?.email || '',
            phone: user?.phone || ''
        }
    });

    useEffect(() => {
        const getPackage = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-packages/single/${packageId}`
                );

                if (data && data.success) {
                    setLsatPackage(data.data);
                }
            } catch (error) {
                console.error(error);
                toast.error('Failed to load package');
            }
        };
        getPackage();
    }, [packageId]);

    const handleCheckout = async (formData) => {
        try {
            setIsProcessing(true);

            // Create package purchase record
            const purchaseData = {
                packageId,
                userEmail: formData.email,
                userName: formData.fullName,
                userPhone: formData.phone
            };

            const { data } = await axios.post(
                `${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-packages/purchase`,
                purchaseData
            );

            if (data && data.success) {
                // Create Stripe checkout session
                const { data: stripeData } = await axios.post(
                    `${import.meta.env.VITE_DOMAIN_URL}/create-checkout-session-package`,
                    {
                        packageId,
                        purchaseId: data.data._id,
                        userEmail: formData.email,
                        userName: formData.fullName
                    }
                );

                if (stripeData) {
                    window.location.href = stripeData.url;
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Checkout failed');
            setIsProcessing(false);
        }
    };

    if (!lsatPackage) {
        return (
            <Container className="min-h-[70vh] flex items-center justify-center">
                <div className="text-center">Loading package...</div>
            </Container>
        );
    }

    return (
        <Container className="min-h-[70vh] pt-32 pb-16">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-blue-950 text-center mb-8">
                    Complete Your Purchase
                </h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Customer Information */}
                    <div>
                        <h2 className="text-xl font-semibold text-blue-900 mb-6">
                            Customer Information
                        </h2>

                        <form onSubmit={handleSubmit(handleCheckout)} className="space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <User size={16} />
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    className="w-full border-2 border-blue-100 rounded-lg px-4 py-3 focus:outline-2 focus:outline-blue-200"
                                    placeholder="Enter your full name"
                                    {...register('fullName', { required: 'Full name is required' })}
                                />
                                {errors.fullName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Mail size={16} />
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    className="w-full border-2 border-blue-100 rounded-lg px-4 py-3 focus:outline-2 focus:outline-blue-200"
                                    placeholder="Enter your email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Phone size={16} />
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    className="w-full border-2 border-blue-100 rounded-lg px-4 py-3 focus:outline-2 focus:outline-blue-200"
                                    placeholder="(+1) 917-XXX-XXXX"
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9+\s()\-]/g, '');
                                    }}
                                    {...register('phone', {
                                        required: 'Phone number is required',
                                        pattern: {
                                            value: /^[0-9+\s()\-]+$/,
                                            message: "Please enter a valid phone number"
                                        }
                                    })}
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? 'Processing...' : `Pay $${lsatPackage.price}`}
                            </button>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <LockKeyholeIcon size={16} />
                                <span>Secure SSL Encrypted Payment</span>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary - Clean Version */}
                    <div className="bg-white border-2 border-blue-100 rounded-xl p-6 h-fit shadow-lg shadow-blue-100/30">
                        <h3 className="text-xl font-bold text-blue-900 mb-6 pb-3 border-b border-blue-100 flex items-center gap-3">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                            Order Summary
                        </h3>

                        <div className="space-y-5">
                            {/* Package Info */}
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg mb-1">{lsatPackage.title}</h4>
                                <p className="text-gray-600 text-sm mb-3">{lsatPackage.sessions} LSAT Tutoring Sessions</p>

                                {/* Pricing */}
                                <div className="flex items-end gap-3 mb-4">
                                    <span className="text-2xl font-bold text-blue-900">${lsatPackage.price}</span>
                                    {lsatPackage.originalPrice && (
                                        <>
                                            <span className="text-lg text-gray-500 line-through">${lsatPackage.originalPrice}</span>
                                            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                                Save {lsatPackage.discount}%
                                            </span>
                                        </>
                                    )}
                                </div>

                                <div className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3">
                                    <strong>${(lsatPackage.price / lsatPackage.sessions).toFixed(2)} per session</strong> • Valid for {lsatPackage.duration}
                                </div>
                            </div>

                            {/* Features */}
                            <div>
                                <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Check className="text-green-500" size={18} />
                                    Package Includes:
                                </h5>
                                <ul className="space-y-2">
                                    {lsatPackage.features.slice(0, 4).map((feature, index) => (
                                        <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                            {feature}
                                        </li>
                                    ))}
                                    {lsatPackage.features.length > 4 && (
                                        <li className="text-sm text-blue-600 font-medium text-center mt-2">
                                            + {lsatPackage.features.length - 4} more benefits
                                        </li>
                                    )}
                                </ul>
                            </div>

                            {/* Total */}
                            <div className="pt-4 border-t border-blue-100">
                                <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                                    <span>Total Due:</span>
                                    <span className="text-blue-900">${lsatPackage.price}</span>
                                </div>
                                <p className="text-xs text-gray-500 text-center mt-2">
                                    One-time payment • No hidden fees
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default LSATPackageCheckout;