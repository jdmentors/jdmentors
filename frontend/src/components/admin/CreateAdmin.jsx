import { AdminSidebar, AdminContainer } from "../";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { EyeIcon, EyeOff, Lock, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import useRefreshToken from "../../hooks/useRefreshToken";
import { useState } from "react";

function CreateAdmin() {
    const { register, handleSubmit, reset } = useForm({
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

            const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/admin/register`, { fullName: formData.fullName, email: formData.email, phone: formData.phone, password: formData.password, userType: 'admin' }, { withCredentials: true, headers: {Authorization: `Bearer ${user.accessToken}`} });

            if (data.success) {
                setIsRegistering(false);
                reset();
                toast.success(data.message);
            }
        } catch (error) {
            console.error(error.message);
            if (error?.response?.data?.message === 'accessToken') {
                const newAccessToken = await refreshAccessToken();

                const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/admin/register`, { fullName: formData.fullName, email: formData.email, phone: formData.phone, password: formData.password, userType: 'admin' }, { withCredentials: true, headers: {Authorization: `Bearer ${newAccessToken}`} });

                if (data && data.success) {
                    reset();
                    toast.success(data.message);
                }
            } else {
                throw new Error(error);
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
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-gray-700" htmlFor="email">Email:</label>
                                            <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="email" type="email" {...register('email', { required: true })} placeholder="Enter email here..." />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-gray-700" htmlFor="phone">Phone:</label>
                                            <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="phone" type="tel" {...register('phone', { required: true })} placeholder="Enter blog phone here..." />
                                        </div>

                                        <div className="text-gray-600 grid grid-cols-1 my-2">
                                            <label className="flex items-center gap-1" htmlFor='regPassword'><Lock size={18} /> <span>Password</span></label>
                                            <div className="relative">
                                                <input id="regPassword" type={`${showPassword ? 'text' : 'password'}`} placeholder="Password" className="text-black border-2 border-blue-100 py-1 px-2 focus-within:outline-2 focus-within:outline-blue-200 rounded my-1 w-full" {...register('password', { required: true })} />
                                                <span onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
                                                    {
                                                        showPassword ? <EyeIcon size={18} /> : <EyeOff size={18} />
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full rounded bg-blue-600 mt-4 text-white text">
                                        <button type="submit" className="w-full p-2 cursor-pointer flex gap-1 items-center justify-center">
                                            <Plus />
                                            <span className="mx-2">Create Admin</span>
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