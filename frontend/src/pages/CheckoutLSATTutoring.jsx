import { CalendarDays, File, LockKeyholeIcon, Mail, Phone, User, UserCheck2 } from "lucide-react";
import { Container, FileInput } from "../components";
import { Link } from "react-router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import useRefreshToken from "../hooks/useRefreshToken";
import { updateUser } from "../features/forms/UserAuthSlice.js";
import toast from "react-hot-toast";

function CheckoutLSATTutoring() {
    const [basePrice, setBasePrice] = useState(null);

    useEffect(() => {
        const getAllOthers = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/others/all`);
                if (data && data.success) {
                    setBasePrice(data.data[0].accommodationPrice);
                    setDiscountedPrice(data.data[0].accommodationPrice);
                }
            } catch (error) {
                console.error(error);
            }
        }
        getAllOthers();
    }, [])

    const formRef = useRef();
    const [isBooking, setIsBooking] = useState(false);
    const user = useSelector(state => state.user.user);
    const [isChecked, setIsChecked] = useState(false);
    const [termsWarning, setTermsWarning] = useState(false);
    const [discountedPrice, setDiscountedPrice] = useState(basePrice);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        defaultValues: {
            fullName: user.fullName || '',
            email: user.email || '',
            phone: user.phone || '',
            preferredContact: [],
            exam: [],
            seekingAccommodations: '',
            previousAccommodation: '',
            providedAccommodations: '',
            supportingDocumentation: '',
            additionalInfomation: '',
            dateTime: '',
            document: '',
        }
    });

    const couponForm = useForm();
    const refreshAccessToken = useRefreshToken();
    const [couponApplied, setCouponApplied] = useState(false);
    const [discount, setDiscount] = useState(0);
    const dispatch = useDispatch();
    const [showAccommodationProvided, setShowAccommodationProvided] = useState(false);
    const [isOtherContactVisible, setIsOtherContactVisible] = useState(false);

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

            userData.preferredContact.forEach((Preferred) => {
                formData.append('preferredContact[]', Preferred);
            });
            userData.exam.forEach((ex) => {
                formData.append('exam[]', ex);
            });

            formData.append('otherContactMethod', userData.otherContactMethod);
            formData.append('seekingAccommodations', userData.seekingAccommodations);
            formData.append('previousAccommodation', userData.previousAccommodation);
            formData.append('providedAccommodations', userData.providedAccommodations);
            formData.append('supportingDocumentation', userData.supportingDocumentation);
            formData.append('additionalInfomation', userData.additionalInfomation);
            formData.append('dateTime', userData.dateTime);
            formData.append('price', Math.round(discountedPrice));

            Object.values(userData.document).forEach((file) => {
                formData.append('document', file);
            });

            const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/accommodations/create`, formData);

            if (data && data.success) {
                toast.success(data.message);
                const accommodationId = data.data._id;
                try {
                    const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/create-checkout-accommodation`, { accommodationId: accommodationId });

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

                    userData.preferredContact.forEach((Preferred) => {
                        formData.append('preferredContact[]', Preferred);
                    });
                    userData.exam.forEach((ex) => {
                        formData.append('exam[]', ex);
                    });

                    formData.append('otherContactMethod', userData.otherContactMethod);
                    formData.append('seekingAccommodations', userData.seekingAccommodations);
                    formData.append('previousAccommodation', userData.previousAccommodation);
                    formData.append('providedAccommodations', userData.providedAccommodations);
                    formData.append('supportingDocumentation', userData.supportingDocumentation);
                    formData.append('additionalInfomation', userData.additionalInfomation);
                    formData.append('dateTime', userData.dateTime);
                    formData.append('price', Math.round(discountedPrice));

                    Object.values(userData.document).forEach((file) => {
                        formData.append('document', file);
                    });

                    const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/accommodations/create`, formData);

                    if (data && data.success) {
                        toast.success(data.message);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                        const accommodationId = data.data._id;
                        try {
                            const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/create-checkout-accommodation`, { accommodationId: accommodationId });

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

    return (
        <section className="min-h-[70vh] pt-24 md:pt-32 relative">
            <Container className="grid md:grid-cols-2 gap-5 lg:gap-14 xl:gap-20 divide-blue-100">
                {/* Customer Information */}
                <section>
                    <h2 className="text-3xl font-bold text-blue-950">Checkout - Accommodations</h2>

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

                            <div className="grid md:grid-cols-2 md:gap-3 items-start">
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
                                    <label className="flex items-center gap-1 text-sm" htmlFor='dateTime'><CalendarDays size={18} /> <span>Upcoming Exam Date (optional)</span></label>
                                    <input id="dateTime" type="date" className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" {...register('dateTime', { required: false })} />
                                    {errors.dateTime && <p className="text-sm text-orange-500 font-light">Something wrong with Date</p>}
                                </div>
                            </div>

                            <div>
                                <p className="flex items-center gap-1"><span>What's your preferred contact method?</span></p>

                                <div className="my-2">
                                    <label className="flex items-center gap-1">
                                        <input type="checkbox" value="E-mail" {...register('preferredContact[]', { required: false })} />
                                        <span>E-mail</span>
                                    </label>

                                    <label className="flex items-center gap-1">
                                        <input type="checkbox" value="Phone" {...register('preferredContact[]', { required: false })} />
                                        <span>Phone</span>
                                    </label>

                                    <label className="flex items-center gap-1">
                                        <input onClick={() => setIsOtherContactVisible(!isOtherContactVisible)} type="checkbox" value="Other" {...register('preferredContact[]', { required: false })} />
                                        <span>Other</span>
                                    </label>
                                </div>
                                {errors.exam && <p className="text-sm text-orange-500 font-light">Exam or programme requesting accommodation for is required.</p>}

                                <div className={`text-black my-2 md:my-3 ${isOtherContactVisible ? 'grid grid-cols-1' : 'hidden'}`}>
                                    <label className="flex items-center gap-1" htmlFor='otherContactMethod'> <span>Tell us the other method to contact you</span></label>
                                    <input id="otherContactMethod" type="text" placeholder="Any way to reach out to you" className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" {...register('otherContactMethod', { required: false })} />
                                    {errors.otherContactMethod && <p className="text-sm text-orange-500 font-light">Other contact method is required</p>}
                                </div>
                            </div>

                            <p className="font-bold text-blue-950 my-4">Exam/School Information</p>

                            <div>
                                <p className="flex items-center gap-1"><span>Which exam or program are you requesting accommodation for?</span></p>

                                <div className="my-2">
                                    <label className="flex items-center gap-1">
                                        <input type="checkbox" value="LSAT" {...register('exam[]', { required: false })} />
                                        <span>LSAT</span>
                                    </label>

                                    <label className="flex items-center gap-1">
                                        <input type="checkbox" value="Law School" {...register('exam[]', { required: false })} />
                                        <span>Law School</span>
                                    </label>

                                    <label className="flex items-center gap-1">
                                        <input type="checkbox" value="Undergraduate" {...register('exam[]', { required: false })} />
                                        <span>Undergraduate</span>
                                    </label>

                                    <label className="flex items-center gap-1">
                                        <input type="checkbox" value="GRE" {...register('exam[]', { required: false })} />
                                        <span>GRE</span>
                                    </label>

                                    <label className="flex items-center gap-1">
                                        <input type="checkbox" value="MPRE" {...register('exam[]', { required: false })} />
                                        <span>MPRE</span>
                                    </label>

                                    <label className="flex items-center gap-1">
                                        <input type="checkbox" value="Bar Exam" {...register('exam[]', { required: false })} />
                                        <span>Bar Exam</span>
                                    </label>
                                </div>
                                {errors.exam && <p className="text-sm text-orange-500 font-light">Exam or programme requesting accommodation for is required.</p>}
                            </div>

                            <p className="font-bold text-blue-950 my-4">Accommodation Needs Information</p>

                            <div className="grid grid-cols-1 my-2 md:my-3 gap-2">
                                <label htmlFor="seekingAccommodations" className="flex items-center gap-1"><span>What specific accommodations are you seeking?</span></label>

                                <textarea id="seekingAccommodations" placeholder="e.g. extended time, separate room, stop-the-clock breaks, paper exam, etc..." className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" rows={4} {...register('seekingAccommodations', { required: false })}></textarea>
                                {errors.seekingAccommodations && <p className="text-sm text-orange-500 font-light">Accommodation information is required.</p>}
                            </div>

                            <div>
                                <p className="flex items-center gap-1"><span>Have you previously received accommodations?</span></p>

                                <div className={`my-2`}>
                                    <label className="flex items-center gap-1">
                                        <input type="radio" onClick={() => setShowAccommodationProvided(true)} value="Yes" {...register('previousAccommodation', { required: false })} />
                                        <span>Yes</span>
                                    </label>

                                    <label className="flex items-center gap-1">
                                        <input type="radio" onClick={() => setShowAccommodationProvided(false)} value="No" {...register('previousAccommodation', { required: false })} />
                                        <span>No</span>
                                    </label>
                                </div>
                                {errors.previousAccommodation && <p className="text-sm text-orange-500 font-light">Previous accommodation is required.</p>}
                            </div>

                            <div className={`grid grid-cols-1 my-2 md:my-3 gap-2 ${showAccommodationProvided ? 'block' : 'hidden'}`}>
                                <label htmlFor="providedAccommodations" className="flex items-center gap-1"><span>Describe what accommodations were provided and how they helped</span></label>

                                <textarea id="providedAccommodations" placeholder="You can share anything important about your situation. It can be helpful." className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" rows={4} {...register('providedAccommodations', { required: false })}></textarea>
                                {errors.providedAccommodations && <p className="text-sm text-orange-500 font-light">Accommodations provided is required.</p>}
                            </div>

                            <p className="font-bold text-blue-950 my-4">Documentation</p>

                            <div>
                                <p className="flex items-center gap-1"><span>Do you already have supporting medical or psychological documentation?</span></p>

                                <div className="my-2">
                                    <label className="flex items-center gap-1">
                                        <input type="radio" value="Yes (ready to submit)" {...register('supportingDocumentation', { required: false })} />
                                        <span>Yes (ready to submit)</span>
                                    </label>

                                    <label className="flex items-center gap-1">
                                        <input type="radio" value="In Progress" {...register('supportingDocumentation', { required: false })} />
                                        <span>In Progress</span>
                                    </label>

                                    <label className="flex items-center gap-1">
                                        <input type="radio" value="No (need guidance)" {...register('supportingDocumentation', { required: false })} />
                                        <span>No (need guidance)</span>
                                    </label>
                                </div>
                                {errors.supportingDocumentation && <p className="text-sm text-orange-500 font-light">supporting medical or psychological documentation is required</p>}
                            </div>

                            <div className="text-gray-600 grid grid-cols-1 my-4">
                                <label className="flex items-center gap-1 text-sm"><File size={18} /> <span>Upload relevant documentation (if available)</span></label>

                                <FileInput {...register('document', { required: false })} />
                                {errors.document && <p className="text-sm text-orange-500 font-light">Please attach at least one document</p>}
                            </div>

                            <p className="font-bold text-blue-950 my-4">Additional Information</p>

                            <div className="grid grid-cols-1 my-2 md:my-3 gap-2">
                                <label htmlFor="additionalInfomation" className="flex items-center gap-1"><span>Anything else we should know about your situation?</span></label>

                                <textarea id="additionalInfomation" placeholder="You can share anything important about your situation. It can be helpful." className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" rows={4} {...register('additionalInfomation', { required: false })}></textarea>
                                {errors.additionalInfomation && <p className="text-sm text-orange-500 font-light">Additional information is required.</p>}
                            </div>
                        </form>
                    </div>
                </section>

                {/* Review Order */}
                <section>
                    <h5 className="font-semibold text-blue-950 md:mt-16">Review Your Order</h5>

                    <div className="bg-blue-50 border border-blue-100 p-5 rounded-md mb-8 mt-5 md:sticky md:top-20 shadow-lg shadow-blue-100">
                        <div className="flex items-center mb-4">
                            <div className="bg-blue-100 p-2.5 rounded-full mr-4 w-10 h-10 flex items-center justify-center">
                                <UserCheck2 className="text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-blue-950">Accommodations</h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Get the support you deserve to succeed at every step of your law journey — from the LSAT, GRE, MPRE, Grad school, and admissions to law school exams, interviews, and the bar.
                        </p>

                        <p className="text-gray-600 mb-4">
                            We support and empower students with cognitive, physical, and mental health challenges by providing advocacy and guidance, ensuring you can fully focus on your LSAT exam and future goals.
                        </p>

                        {/* Coupon Code */}
                        <div className="mt-5 text-gray-600">
                            <form onSubmit={couponForm.handleSubmit(handleCoupon)}>
                                <div className="flex gap-2 mb-4 w-full flex-wrap relative">
                                    <input type="text" placeholder="Have a coupon?" className={`border-2 border-blue-200 grow py-1.5 px-2 rounded focus-within:outline-2 focus-within:outline-blue-200 w-full sm:w-1/3 ${couponApplied ? 'text-gray-600' : 'text-black'}`} disabled={couponApplied} readOnly={couponApplied} {...couponForm.register('coupon', { required: false })} />
                                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 underline cursor-pointer" disabled={couponApplied}>{couponApplied ? 'Applied' : 'Apply'}</button>
                                </div>
                            </form>

                            <p className="flex justify-between">Base Price: <span className="font-light text-xl text-black mb-2">${basePrice}</span></p>
                            <p className="flex justify-between">Discount: <span className="font-light text-xl text-black mb-2">- {discount}%</span></p>
                            <p className="flex justify-between">Discounted Price: <span className="font-semibold text-xl text-black mb-2">${Math.round(discountedPrice)}</span></p>

                            <label className="flex gap-2 items-center">
                                <input type="checkbox" checked={isChecked} onChange={(e) => { setIsChecked(e.target.checked); setTermsWarning(!e.target.checked); }} />
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
            </Container>
        </section>
    );
}

export default CheckoutLSATTutoring;