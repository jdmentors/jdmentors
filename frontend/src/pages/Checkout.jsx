import { CalendarDays, Check, File, LockKeyholeIcon, Mail, Notebook, Phone, User, UserCheck2 } from "lucide-react";
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

    const { register, handleSubmit, reset, formState: {errors} } = useForm({
        defaultValues: {
            fullName: user.fullName || '',
            email: user.email || '',
            phone: user.phone || '',
            dateTime: '',
            notes: '',
            document: '',
        }
    });

    const [isBooking, setIsBooking] = useState(false);

    const formRef = useRef();
    const [service, setService] = useState(null);
    const refreshAccessToken = useRefreshToken();
    const dispatch = useDispatch();

    const { serviceId } = useParams();

    useEffect(() => {
        const getService = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/services/single/${serviceId}`);

                if (data && data.success) {
                    setService(data.data);
                }
            } catch (error) {
                console.error(error);
            }
        }
        getService();
    }, [serviceId])

    const [isChecked, setIsChecked] = useState(false);
    const [termsWarning, setTermsWarning] = useState(false);

    const checkoutHandler = async (userData) => {
        try {
            if(!isChecked){
                setTermsWarning(true);
                return;
            }

            setIsBooking(true);
            const formData = new FormData();

            formData.append('fullName', userData.fullName);
            formData.append('email', userData.email);
            formData.append('phone', userData.phone);
            formData.append('dateTime', userData.dateTime);
            formData.append('notes', userData.notes);
            formData.append('service', serviceId);
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
                    formData.append('notes', userData.notes);
                    formData.append('service', serviceId);
                    formData.append('document', userData.document[0]);

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
            }else{
                toast.error(message);
                console.log(error)
                setIsBooking(false);
            }
        }
    }

    return (
        <section className="min-h-[70vh] mt-24 md:mt-32">
            <Container className="grid md:grid-cols-2 gap-5 lg:gap-14 xl:gap-20 divide-blue-100">
                {/* Customer Information */}
                <section>
                    <h2 className="text-3xl font-bold text-blue-950">Checkout</h2>

                    <div className="my-8">
                        <h5 className="font-semibold text-blue-950">Customer Information</h5>
                        <form ref={formRef} onSubmit={handleSubmit(checkoutHandler)} className="border border-blue-100 p-5 rounded-md my-5 shadow-lg shadow-blue-100">
                            <div className="grid md:grid-cols-2 md:gap-3">
                                <div className="text-gray-600 grid grid-cols-1 my-2 md:my-3">
                                    <label className="flex items-center gap-1 text-sm" htmlFor='fullName'><User size={18} /> <span>Full Name *</span></label>
                                    <input id="fullName" type="text" placeholder="e.g. Alan Parker" className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" {...register('fullName', { required: true })} />
                                </div>

                                <div className="text-gray-600 grid grid-cols-1 my-2 md:my-3">
                                    <label className="flex items-center gap-1 text-sm" htmlFor='email'><Mail size={18} /> <span>E-Mail *</span></label>
                                    <input id="email" type="email" placeholder="name@example.com" className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" {...register('email', { required: true })} />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 md:gap-3">
                                <div className="text-gray-600 grid grid-cols-1 my-2 md:my-3">
                                    <label className="flex items-center gap-1 text-sm" htmlFor='phone'><Phone size={18} /> <span>Phone *</span></label>
                                    <input id="phone" type="tel" placeholder="(+1) 917-XXX-XXXX" className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" {...register('phone', { required: true })} />
                                </div>

                                <div className="text-gray-600 grid grid-cols-1 my-2 md:my-3">
                                    <label className="flex items-center gap-1 text-sm" htmlFor='dateTime'><CalendarDays size={18} /> <span>Preferred Date & Time *</span></label>
                                    <input id="dateTime" type="datetime-local" className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" {...register('dateTime', { required: true })} />
                                </div>
                            </div>

                            <div className="text-gray-600 grid grid-cols-1 my-2 md:my-3">
                                <label htmlFor="notes" className="flex items-center gap-1 text-sm"><Notebook size={18} /> <span>Special Note</span></label>

                                <textarea id="notes" placeholder="e.g. what your goals are, what you're hoping to do, where you're hoping to get into, etc." className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" rows={4} {...register('notes', {required: false})}></textarea>
                            </div>

                            <div className="text-gray-600 grid grid-cols-1 my-2 md:my-3">
                                <label className="flex items-center gap-1 text-sm"><File size={18} /> <span>Document(s) to be reviewed *</span></label>

                                <FileInput {...register('document', { required: true })} />
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
                                        <h3 className="text-lg font-semibold text-blue-950">{service.title}</h3>
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        {service.description}
                                    </p>
                                    <ul className="text-gray-600 space-y-2">
                                        {
                                            service.features.map(feature => (
                                                <li key={feature} className="flex items-start gap-1">
                                                    <Check className="text-blue-600" size={18} />
                                                    <span>{feature}</span>
                                                </li>
                                            ))
                                        }
                                    </ul>

                                    <div className="mt-5 text-gray-600">
                                        <p className="flex justify-between">Total Price: <span className="font-semibold text-xl text-black mb-2">${service.price}</span></p>

                                        <label className="flex gap-2 items-center">
                                            <input type="checkbox" checked={isChecked} onChange={(e) => {setIsChecked(e.target.checked); setTermsWarning(!e.target.checked)}} />
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