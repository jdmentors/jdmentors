import { AdminSidebar, AdminContainer } from "../";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { EyeIcon, EyeOff, Lock } from "lucide-react";
import { useSelector } from "react-redux";
import useRefreshToken from "../../hooks/useRefreshToken";
import { useState } from "react";

function CreateAdmin() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            password: '',
            userType: 'admin'
        }
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const user = useSelector(state => state.user.user);
    const refreshAccessToken = useRefreshToken();

    const registerFormHandler = async (formData) => {
        try {
            setIsRegistering(true);

            const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/admin/register`, { fullName: formData.fullName, email: formData.email, phone: formData.phone, password: formData.password, userType: 'admin' }, { withCredentials: true, headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data.success) {
                setIsRegistering(false);
                reset();
                toast.success(data.message);
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message == 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/admin/register`, { fullName: formData.fullName, email: formData.email, phone: formData.phone, password: formData.password, userType: 'admin' }, { withCredentials: true, headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        reset();
                        toast.success(data.message);
                        setIsRegistering(false);
                    }
                } catch (error) {
                    const message = error?.response?.data?.message;
                    toast.error(message);
                    setIsRegistering(false);
                }
            } else {
                toast.error(message);
                setIsRegistering(false);
            }
        }
    }

    return (
        <section className="flex min-h-[90vh]">
            <AdminSidebar />

            <AdminContainer>
                <section className="my-auto">

                    <div className="max-w-full">
                        <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">Create Admin</h2>
                        <p className="text-gray-600">Add a new administrator to help manage operations and streamline platform control.</p>
                    </div>

                    <div className="flex gap-4 mt-10">
                        <div
                            className="w-full lg:w-4/5 xl:w-2xl shadow-[5px_5px_20px_rgba(219,234,254,1),-5px_-5px_20px_rgba(219,234,254,1)] p-10 rounded-xl h-fit relative">
                            <div>
                                <form onSubmit={handleSubmit(registerFormHandler)} encType="multipart/form-data">
                                    <div className="grid sm:grid-cols-2 gap-2">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-gray-700" htmlFor="fullName">Full Name:</label>
                                            <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="fullName" type="text" {...register('fullName', { required: true })} placeholder="Enter fullName here..." />
                                            {errors.fullName && <p className="text-sm text-orange-500 font-light">Full Name is required.</p>}
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-gray-700" htmlFor="email">Email:</label>
                                            <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="email" type="email" {...register('email', { required: true })} placeholder="Enter email here..." />
                                            {errors.email && <p className="text-sm text-orange-500 font-light">Email is required.</p>}
                                        </div>

                                        {/* <div className="flex flex-col gap-2">
                                            <label className="text-gray-700" htmlFor="phone">Phone:</label>
                                            <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="phone" type="tel" {...register('phone', { required: true })} placeholder="Enter blog phone here..." />
                                            {errors.phone && <p className="text-sm text-orange-500 font-light">Phone is required.</p>}
                                        </div> */}

                                        <div className="text-gray-600 grid grid-cols-1 my-2 md:my-3">
                                            <label className="text-gray-700" htmlFor='phone'>
                                                Phone
                                            </label>
                                            <input
                                                id="phone"
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

                                        <div className="text-gray-600 grid grid-cols-1 my-2">
                                            <label className="flex items-center gap-1" htmlFor='regPassword'>Password</label>
                                            <div className="relative">
                                                <input id="regPassword" type={`${showPassword ? 'text' : 'password'}`} placeholder="Password" className="text-black border-2 border-blue-100 py-1 px-2 focus-within:outline-2 focus-within:outline-blue-200 rounded my-1 w-full" {...register('password', { required: true })} />
                                                <span onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
                                                    {
                                                        showPassword ? <EyeIcon size={18} /> : <EyeOff size={18} />
                                                    }
                                                </span>
                                            </div>
                                            {errors.password && <p className="text-sm text-orange-500 font-light">Password is required.</p>}
                                        </div>
                                    </div>
                                    <div className="w-full rounded bg-blue-600 mt-4 text-white text">
                                        <button className="p-2 w-full rounded-md text-white bg-blue-600 cursor-pointer shadow-lg shadow-blue-200" type="submit">
                                            {
                                                !isRegistering ? 'Create Admin' :
                                                    (<span className="flex space-x-1 items-center justify-center py-2">
                                                        <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                        <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                                                        <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.1s]"></span>
                                                        <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"></span>
                                                    </span>)
                                            }
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </AdminContainer>
        </section>
    );
}

export default CreateAdmin;