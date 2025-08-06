import { useForm } from "react-hook-form";
import { Container } from "../components";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import axios from "axios";
import { EyeIcon, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

function ResetPassword() {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            newPassword: ''
        }
    })

    const { search } = useLocation();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const resetPasswordHandler = async (formData) => {
        try {
            const id = search.split("=")[1];

            const { data } = await axios.put(`/api/v1/users/reset-password?id=${id}`, { newPassword: formData.newPassword });

            if (data.success) {
                toast.success(data.message);
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message);
        }
    }

    return (
        <Container className="mt-20 min-h-[60vh] flex items-center justify-center">
            <section className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 bg-white px-6 sm:px-8 md:px-10 py-10 rounded-md drop-shadow-xl drop-shadow-blue-300 border-2 border-blue-100 relative flex overflow-hidden">
                <form onSubmit={handleSubmit(resetPasswordHandler)} className="w-full">
                    <h3 className="text-2xl text-center mb-3">Reset Password</h3>

                    <div className="text-gray-600 grid grid-cols-1 my-2">
                        <label className="flex items-center gap-1" htmlFor="newPassword">
                            <Lock size={18} />
                            <span>Password</span>
                        </label>

                        <div className="relative">
                            <input id="newPassword" type={`${showPassword ? 'text' : 'password'}`} placeholder="New Password" className="text-black border-2 border-blue-100 py-1 px-2 focus-within:outline-2 focus-within:outline-blue-200 rounded my-1 w-full" {...register('newPassword', { required: true })} />
                            <span onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
                                {
                                    showPassword ? <EyeIcon size={18} /> : <EyeOff size={18} />
                                }
                            </span>
                        </div>
                    </div>

                    <button className="w-full bg-blue-600 py-2 text-white rounded cursor-pointer my-2 font-light" type="submit">Reset</button>
                </form>
            </section>
        </Container>
    );
}

export default ResetPassword;