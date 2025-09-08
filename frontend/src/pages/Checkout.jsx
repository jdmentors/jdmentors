import { CalendarDays, Check, File, Gift, LockKeyholeIcon, Mail, Notebook, Phone, Plus, Puzzle, Settings, User, UserCheck2, X } from "lucide-react";
import { Container, FileInput, LoadingSpinner } from "../components";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRef } from "react";
import { Link, useParams } from "react-router";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import useRefreshToken from "../hooks/useRefreshToken";
import { updateUser } from "../features/forms/UserAuthSlice.js";

function Checkout() {
    const user = useSelector(state => state.user.user);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            fullName: user.fullName || '',
            email: user.email || '',
            phone: user.phone || '',
            dateTime: '',
            notes: null,
            document: '',
        }
    });

    const [isBooking, setIsBooking] = useState(false);

    const formRef = useRef();
    const [service, setService] = useState(null);
    const refreshAccessToken = useRefreshToken();
    const dispatch = useDispatch();
    const [isDocumentRequired, setIsDocumentRequired] = useState(false);

    const { serviceType, serviceId } = useParams();
    const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
    const capitalizedServiceType = capitalize(serviceType);

    useEffect(() => {
        const getService = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/${serviceType}s/single/${serviceId}`);

                if (data && data.success) {
                    setService(data.data);
                    setDiscountedPrice(data.data.price);
                    setIsDocumentRequired(data.data.isDocumentRequired);
                }
            } catch (error) {
                console.error(error);
            }
        }
        getService();
    }, [serviceId])

    const [isChecked, setIsChecked] = useState(false);
    const [termsWarning, setTermsWarning] = useState(false);
    const [showAddonsAndExtraPopUp, setShowAddonsAndExtraPopUp] = useState(false);
    const [addonsAndExtras, setAddonsAndExtras] = useState([]);
    const [discountedPrice, setDiscountedPrice] = useState(null);

    const checkoutHandler = async (userData) => {
        try {
            if (!isChecked) {
                setTermsWarning(true);
                return;
            }

            setIsBooking(true);
            const formData = new FormData();

            formData.append('fullName', userData.fullName);
            formData.append('email', userData.email);
            formData.append('phone', userData.phone);
            formData.append('dateTime', userData.dateTime);
            formData.append('notes', userData.notes || null);
            formData.append('service', serviceId);
            formData.append('serviceType', capitalizedServiceType);
            formData.append('price', Math.round(discountedPrice));
            addonsAndExtras.forEach((addonAndExtra) => {
                formData.append('addonsAndExtras[]', addonAndExtra);
            });
            Object.values(userData.document).forEach((file) => {
                formData.append('document', file);
            })

            const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/sessions/create`, formData);

            if (data && data.success) {
                toast.success(data.message);
                const sessionId = data.data._id;
                try {
                    const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/create-checkout-session`, { sessionId: sessionId });

                    if (data) {
                        window.location.href = data.url;
                    }
                } catch (error) {
                    const message = error?.response?.data?.message;
                    toast.error(message);
                    setIsBooking(false);
                }
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const formData = new FormData();

                    formData.append('fullName', userData.fullName);
                    formData.append('email', userData.email);
                    formData.append('phone', userData.phone);
                    formData.append('dateTime', userData.dateTime);
                    formData.append('notes', userData.notes || null);
                    formData.append('service', serviceId);
                    formData.append('serviceType', capitalizedServiceType);
                    formData.append('price', Math.round(discountedPrice));
                    addonsAndExtras.forEach((addonAndExtra) => {
                        formData.append('addonsAndExtras[]', addonAndExtra);
                    });
                    Object.values(userData.document).forEach((file) => {
                        formData.append('document', file);
                    })

                    const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/sessions/create`, formData);

                    if (data && data.success) {
                        toast.success(data.message);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                        const sessionId = data.data._id;
                        try {
                            const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/create-checkout-session`, { sessionId: sessionId });

                            if (data) {
                                window.location.href = data.url;
                            }
                        } catch (error) {
                            const message = error?.response?.data?.message;
                            toast.error(message);
                            setIsBooking(false);
                        }
                    }
                } catch (error) {
                    const message = error?.response?.data?.message;
                    toast.error(message);
                    setIsBooking(false);
                }
            } else {
                toast.error(message);
                console.log(error)
                setIsBooking(false);
            }
        }
    }

    const couponForm = useForm();
    const [couponApplied, setCouponApplied] = useState(false);
    const [discount, setDiscount] = useState(0);

    const handleCoupon = async (couponData) => {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/coupons/validity`, { coupon: couponData.coupon });

            if (data && data.success) {
                toast.success(data.message);
                setCouponApplied(true);
                setDiscount(data.data.discount);
                setDiscountedPrice(prevPrice => prevPrice - (prevPrice * data.data.discount / 100));
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message);
        }
    }

    const addonAndExtraHandler = (e, title, price) => {
        try {
            if (e.target.checked) {
                setDiscountedPrice(discountedPrice => Number(discountedPrice) + (Number(price) - (Number(price) * Number(discount) / 100)));
                setAddonsAndExtras(prev => [...prev, title]);
            } else {
                setDiscountedPrice(discountedPrice => Number(discountedPrice) - (Number(price) - (Number(price) * Number(discount) / 100)));
                setAddonsAndExtras(previous => previous.filter(prev => prev != title));
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <section className="min-h-[70vh] pt-24 md:pt-32 relative">
            {
                (showAddonsAndExtraPopUp && service) && (serviceType == 'service') && (service?.addons.length > 0 || service?.extras.length > 0) &&
                (
                    <section className="fixed top-0 right-0 left-0 bottom-0 bg-black/70 z-50">
                        <div className="absolute bg-white w-lg max-w-full top-1/2 left-1/2 -translate-1/2 p-6 space-y-4 max-h-[100vh] overflow-y-auto">
                            <button onClick={() => setShowAddonsAndExtraPopUp(false)} className="absolute right-5 cursor-pointer"><X size={32} /></button>
                            <h1 className="text-2xl font-bold mb-3 text-gray-900">
                                Customize Your Service
                            </h1>
                            <p className="text-gray-600 mb-4">
                                Select add-ons and extras (optional)
                            </p>

                            {
                                service?.addons.length > 0 && service?.addons.map(addon => (
                                    <label key={addon.title} className="flex items-start space-x-3 p-4 border border-blue-200 rounded-lg hover:border-blue-400 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="mt-1 h-4 w-4 text-blue-600"
                                            onChange={(e) => addonAndExtraHandler(e, addon.title, addon.price)}
                                            checked={addonsAndExtras.includes(addon.title)}
                                        />
                                        <div className="w-full">
                                            <div className="flex justify-between">
                                                <h3 className="font-medium text-gray-900">{addon.title}</h3>
                                                <span className="text-blue-600 text-lg font-semibold">+${addon.price}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">{addon.description}</p>
                                        </div>
                                    </label>
                                ))
                            }

                            {
                                service?.extras.map(extra => (
                                    <label key={extra.title} className="flex items-start space-x-3 p-4 border border-blue-200 rounded-lg hover:border-blue-400 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="mt-1 h-4 w-4 text-blue-600"
                                            onChange={(e) => addonAndExtraHandler(e, extra.title, extra.price)}
                                            checked={addonsAndExtras.includes(extra.title)}
                                        />
                                        <div className="w-full">
                                            <div className="flex justify-between">
                                                <h3 className="font-medium text-gray-900">{extra.title}</h3>
                                                <span className="text-blue-600 text-lg font-semibold">+${extra.price}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">{extra.description}</p>
                                        </div>
                                    </label>
                                ))
                            }

                            <button onClick={() => setShowAddonsAndExtraPopUp(false)} type="button" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white rounded cursor-pointer w-full my-2">Continue to Booking</button>
                        </div>
                    </section>
                )
            }

            <Container className="grid md:grid-cols-2 gap-5 lg:gap-14 xl:gap-20 divide-blue-100">
                {/* Customer Information */}
                <section>
                    <h2 className="text-3xl font-bold text-blue-950">Checkout</h2>

                    <div className="my-8">
                        <h5 className="font-semibold text-blue-950">Customer Information</h5>
                        <form ref={formRef} onSubmit={handleSubmit(checkoutHandler)} className="border border-blue-100 p-5 rounded-md my-5 shadow-lg shadow-blue-100">
                            <div className="grid md:grid-cols-2 md:gap-3">
                                <div className="text-gray-600 grid grid-cols-1 my-2 md:my-3">
                                    <label className="flex items-center gap-1 text-sm" htmlFor='fullNameCheckout'><User size={18} /> <span>Full Name *</span></label>
                                    <input id="fullNameCheckout" type="text" placeholder="e.g. Alan Parker" className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" {...register('fullName', { required: true })} />
                                    {errors.fullName && <p className="text-sm text-orange-500 font-light">Full name is required</p>}
                                </div>

                                <div className="text-gray-600 grid grid-cols-1 my-2 md:my-3">
                                    <label className="flex items-center gap-1 text-sm" htmlFor='emailCheckout'><Mail size={18} /> <span>E-Mail *</span></label>
                                    <input id="emailCheckout" type="email" placeholder="name@example.com" className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" {...register('email', { required: true })} />
                                    {errors.email && <p className="text-sm text-orange-500 font-light">Email is required</p>}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 md:gap-3">
                                <div className="text-gray-600 grid grid-cols-1 my-2 md:my-3">
                                    <label className="flex items-center gap-1 text-sm" htmlFor='phoneCheckout'>
                                        <Phone size={18} /> <span>Phone *</span>
                                    </label>
                                    <input
                                        id="phoneCheckout"
                                        type="tel"
                                        placeholder="(+1) 917-XXX-XXXX"
                                        className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200"
                                        onInput={(e) => {
                                            e.target.value = e.target.value.replace(/[^0-9+\s()\-]/g, '');
                                        }}
                                        {...register('phone', {
                                            required: true,
                                            pattern: {
                                                value: /^[0-9+\s()\-]+$/,
                                                message: "Please enter a valid phone number (numbers, +, -, () only)"
                                            }
                                        })}
                                    />
                                    {errors.phone?.type === 'required' && (
                                        <p className="text-sm text-orange-500 font-light">Phone is required</p>
                                    )}
                                    {errors.phone?.type === 'pattern' && (
                                        <p className="text-sm text-orange-500 font-light">{errors.phone.message}</p>
                                    )}
                                </div>

                                <div className="text-gray-600 grid grid-cols-1 my-2 md:my-3">
                                    <label className="flex items-center gap-1 text-sm" htmlFor='dateTime'><CalendarDays size={18} /> <span>Preferred Meeting Time (optional)</span></label>
                                    <input id="dateTime" type="datetime-local" className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" {...register('dateTime', { required: false })} />
                                    {errors.dateTime && <p className="text-sm text-orange-500 font-light">Something wrong with Date & Time</p>}
                                </div>
                            </div>

                            <div className="text-gray-600 grid grid-cols-1 my-2 md:my-3">
                                <label htmlFor="notes" className="flex items-center gap-1 text-sm"><Notebook size={18} /> <span>Notes For Your Consultant</span></label>

                                <textarea id="notes" placeholder="Share your priorities, questions, or anything specific you're looking for here..." className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" rows={4} {...register('notes', { required: false })}></textarea>
                                {errors.notes && <p className="text-sm text-orange-500 font-light">something wrong with notes</p>}
                            </div>

                            <div className={`text-gray-600 my-2 md:my-3 ${isDocumentRequired ? 'grid grid-cols-1' : 'hidden'}`}>
                                <label className="flex items-center gap-1 text-sm"><File size={18} /> <span>Document(s) to be reviewed</span></label>

                                <FileInput {...register('document', { required: false })} />
                                {errors.document && <p className="text-sm text-orange-500 font-light">Please attach at least one document</p>}
                            </div>
                        </form>
                    </div>
                </section>

                {/* Review Order */}
                {
                    service
                        ?
                        (
                            <section>
                                <h5 className="font-semibold text-blue-950 md:mt-16">Review Your Order</h5>

                                <div className="bg-blue-50 border border-blue-100 p-5 rounded-md mb-8 mt-5 md:sticky md:top-20 shadow-lg shadow-blue-100">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-blue-100 p-2.5 rounded-full mr-4 w-10 h-10 flex items-center justify-center">
                                            <UserCheck2 className="text-blue-600" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-blue-950">{service.title}</h3>
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        {service.description}
                                    </p>
                                    {
                                        service.features && service.features.length > 0 &&
                                        <>
                                            <p className="text-gray-600 my-2 font-semibold">Features:</p>
                                            <ul className="text-gray-600 space-y-2">
                                                {
                                                    service.features.map(feature => (
                                                        <li key={feature} className="flex items-center gap-1">
                                                            <Check className="text-blue-600" size={18} />
                                                            <span>{feature}</span>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </>
                                    }

                                    {
                                        addonsAndExtras && addonsAndExtras.length > 0 &&
                                        <>
                                            <p className="text-gray-600 my-3 font-semibold">Add-ons & Extras:</p>
                                            <ul className="text-gray-600 space-y-2">
                                                {
                                                    addonsAndExtras.map(addonAndExtra => (
                                                        <li key={addonAndExtra} className="flex items-center gap-1">
                                                            <Plus className="text-blue-600 flex-shrink-0" size={18} />
                                                            <span>{addonAndExtra}</span>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </>
                                    }

                                    {
                                        service.services && service.services.length > 0 &&
                                        <>
                                            <p className="text-gray-600 my-2 font-semibold">Services:</p>
                                            <ul className="text-gray-600 space-y-2">
                                                {
                                                    service.services.map(service => (
                                                        <li key={service} className="flex items-center gap-1">
                                                            <Settings className="text-blue-600 flex-shrink-0" size={18} />
                                                            <span>{service}</span>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </>
                                    }

                                    {
                                        (service.addons && service.addons.length && serviceType == 'package') > 0 &&
                                        <>
                                            <p className="text-gray-600 my-2 font-semibold">Add-ons:</p>
                                            <ul className="text-gray-600 space-y-2">
                                                {
                                                    service.addons.map(addon => (
                                                        <li key={addon} className="flex items-center gap-1">
                                                            <Plus className="text-blue-600 flex-shrink-0" size={18} />
                                                            <span>{addon}</span>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </>
                                    }

                                    {
                                        (service.extras && service.extras.length > 0 && serviceType == 'package') &&
                                        <>
                                            <p className="text-gray-600 my-2 font-semibold">Extras:</p>
                                            <ul className="text-gray-600 space-y-2">
                                                {
                                                    service.extras.map(extra => (
                                                        <li key={extra} className="flex items-center gap-1">
                                                            <Gift className="text-blue-600 flex-shrink-0" size={18} />
                                                            <span>{extra}</span>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </>
                                    }

                                    {/* Coupon Code */}
                                    <div className="mt-5 text-gray-600">
                                        <form onSubmit={couponForm.handleSubmit(handleCoupon)}>
                                            <div className="flex gap-2 mb-4 w-full flex-wrap relative">
                                                <input type="text" placeholder="Have a coupon?" className={`border-2 border-blue-200 grow py-1.5 px-2 rounded focus-within:outline-2 focus-within:outline-blue-200 w-full sm:w-1/3 ${couponApplied ? 'text-gray-600' : 'text-black'}`} disabled={couponApplied} readOnly={couponApplied} {...couponForm.register('coupon', { required: false })} />
                                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 underline cursor-pointer" disabled={couponApplied}>{couponApplied ? 'Applied' : 'Apply'}</button>
                                            </div>
                                        </form>

                                        <p className="flex justify-between">Base Price: <span className="font-light text-xl text-black mb-2">${service.price}</span></p>
                                        <p className="flex justify-between">Discount: <span className="font-light text-xl text-black mb-2">- {discount}%</span></p>
                                        <p className="flex justify-between">Discounted Price: <span className="font-semibold text-xl text-black mb-2">${Math.round(discountedPrice)}</span></p>

                                        {serviceType == 'service' && (
                                            <p onClick={() => setShowAddonsAndExtraPopUp(true)} className="text-blue-600 flex items-center gap-1 cursor-pointer"><span className="text-2xl">+</span> <span className="underline">Add-ons & Extras (optional)</span></p>
                                        )}

                                        <label className="flex gap-2 items-center">
                                            <input type="checkbox" checked={isChecked} onChange={(e) => { setIsChecked(e.target.checked); setTermsWarning(!e.target.checked); addonsAndExtras.length < 1 &&setShowAddonsAndExtraPopUp(true); }} />
                                            <span>I have read and agree to the <Link className="text-blue-600 underline" to="/terms-conditions">terms & conditions.</Link></span>
                                        </label>

                                        <p className={`text-orange-500 text-sm my-2 ${termsWarning ? 'block' : 'hidden'}`}>You need to accept the Terms and Conditions to proceed.</p>

                                        <button onClick={() => formRef.current.requestSubmit()} type="button" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white rounded cursor-pointer w-full my-5">
                                            {
                                                !isBooking ? 'Book Now' :
                                                    (<span className="flex space-x-1 items-center justify-center py-2">
                                                        <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                        <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                                                        <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.1s]"></span>
                                                        <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"></span>
                                                    </span>)
                                            }
                                        </button>

                                        <div className="text-sm text-gray-500">
                                            <p className="flex items-center gap-1 text-sm font-semibold text-black mb-1.5"><LockKeyholeIcon size={18} strokeWidth={1.5} /> Secured Checkout - SSL Encrypted</p>

                                            <p>Enusring your financial and personal details are secure during every transaction.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )
                        :
                        <LoadingSpinner />
                }
            </Container>
        </section>
    );
}

export default Checkout;