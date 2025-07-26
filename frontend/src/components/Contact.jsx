import { Container } from "../components";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useState, useEffect } from "react";
import { Clock, Mail, Phone } from "lucide-react";

function Contact() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name:'',
            email:'',
            phone:'',
            service:'select',
            message:'',
        }
    });
    const { pathname } = useLocation();
    const [sending, setSending] = useState(false);

    const submitHandler = async (formData) => {
        try {
            console.log(formData);
            // setSending(true);
            // const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_NAME}/api/v1/contact`, {name:formData.name, email:formData.email, phone:formData.phone, service:formData.service || 'User Query', message:formData.message});

            // if(data && data.success){
            //     setSending(false);
            //     toast.success(data.message);
            //     reset();
            //     window.scrollTo({ top: 0, behavior: 'smooth' });
            // }else{
            //     toast.error(data.message);
            // }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <Container>
            <section className="grid grid-cols-1 md:grid-cols-2 items-start gap-16 my-20">
                <div className="flex flex-col gap-16">
                    <div>
                        <h2 className="text-3xl font-bold text-blue-950">
                            Get In Touch
                        </h2>
                        <p className="text-sm md:text-lg text-blue-950 mt-6 mb-8">
                            Have questions about our services or the consultation process? Reach out and we'll get back to you within 24 hours.
                        </p>
                        <div className="grid grid-cols-1 gap-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Phone size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                                        Phone
                                    </h3>
                                    <Link to='tel:+199774444' className="text-blue-950 hover:underline">(+1) 99 7828XXXX</Link>
                                    <p className="text-sm text-gray-500">
                                        24/7 Emergency Service
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Mail size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                                        Email
                                    </h3>
                                    <Link to='mailto:support@jdmentors.com' className="text-blue-950 break-all hover:underline">support@jdmentors.com</Link>
                                    <p className="text-sm text-gray-500">
                                        We respond within 24 hour
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Clock size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                                        Business Hours
                                    </h3>
                                    <p className="text-blue-950">
                                        Mon - Fri: 9:00 AM - 6:00 PM EST <br />
                                        Sat: 10:00 AM - 2:00 PM EST
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Emergency service available 24/7
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-5 md:p-7 lg:p-8 border border-blue-100 shadow-lg shadow-blue-100 rounded-lg">
                    <h2 className="text-2xl font-bold text-blue-950 mb-6">
                        Book Your Consultation
                    </h2>
                    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
                        <div>
                            <label className="text-sm font-medium leading-none text-blue-950" htmlFor="name">
                                Name
                                *</label>
                            <input className="flex h-10 w-full rounded-md border border-blue-100 bg-background px-3 py-2 text-base focus:outline-1 focus:outline-blue-200 md:text-sm mt-2" id="name" placeholder="eg. Nathan" {...register('name', { required: true })} />
                        </div>
                        <div>
                            <label className="text-sm font-medium leading-none text-blue-950" htmlFor="email">
                                Email
                                *</label>
                            <input type="email" className="flex h-10 w-full rounded-md border border-blue-100 bg-background px-3 py-2 text-base focus:outline-1 focus:outline-blue-200 md:text-sm mt-2" id="email" placeholder="name@example.com" {...register('email', { required: true })} />
                        </div>
                        <div>
                            <label className="text-sm font-medium leading-none text-blue-950" htmlFor="phone">
                                Phone
                                *</label>
                            <input type="tel" className="flex h-10 w-full rounded-md border border-blue-100 bg-background px-3 py-2 text-base focus:outline-1 focus:outline-blue-200 md:text-sm mt-2" id="phone" placeholder="(+1) 99 8XXXXX" {...register('phone', { required: true })} />
                        </div>
                        <div>
                            <label className="text-sm font-medium leading-none text-blue-950" htmlFor="service">
                                Service Interested In
                            </label>

                            <select {...register('service', { required: true })} id="service" className="flex h-10 w-full rounded-md border border-blue-100 bg-background px-3 py-2 text-base focus:outline-1 focus:outline-blue-200 md:text-sm mt-2">
                                <option value="select">Select Service</option>
                                <option value="Personal Statement Review">Personal Statement Review</option>
                                <option value="Addendum Consultation">Addendum Consultation</option>
                                <option value="Application Strategy Session">Application Strategy Session</option>
                                <option value="Package Deal">Package Deal</option>
                                <option value="Package Deal">Package Deal (All Services)</option>
                                <option value="Not Sure - Need Guidance">Not Sure - Need Guidance</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium leading-none text-blue-950" htmlFor="message">
                                Message
                                *</label>
                            <textarea className="flex h-10 w-full rounded-md border border-blue-100 bg-background px-3 py-2 text-base focus:outline-1 focus:outline-blue-200 md:text-sm mt-2 min-h-[120px]" id="message" placeholder={`Tell us how we can help you...`} {...register('message', { required: true })}></textarea>
                        </div>
                        <button className="inline-flex items-center justify-center gap-2 text-sm font-medium h-11 rounded-md px-8 w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer" type="submit">
                            {
                                !sending ? 'Send Message' :
                                    (<span className="flex space-x-1">
                                        <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                                        <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.1s]"></span>
                                        <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"></span>
                                    </span>)
                            }
                        </button>
                    </form>
                </div>

            </section>
        </Container>
    );
}

export default Contact;