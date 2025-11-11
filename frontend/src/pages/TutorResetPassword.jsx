import { useForm } from "react-hook-form";
import { Container } from "../components";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import axios from "axios";
import { EyeIcon, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { showAuthForm, toggleShowUserAuthForm } from "../features/forms/UserAuthSlice.js";
import { useDispatch } from "react-redux";

function TutorResetPassword() {
    const location = useLocation();
    const [token, setToken] = useState(location.search.split('=')[1]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!token) {
            toast.error('Invalid URL');
            navigate('/');
            return;
        }
    }, [token]);

    const { register, handleSubmit } = useForm({
        defaultValues: {
            newPassword: ''
        }
    })

    const { search } = useLocation();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isResetting, setIsResetting] = useState(false);

    const resetPasswordHandler = async (formData) => {
        try {
            setIsResetting(true);
            const { data } = await axios.post(
                `${import.meta.env.VITE_DOMAIN_URL}/api/v1/tutors/reset-password/${token}`, 
                { newPassword: formData.newPassword }
            );

            if (data.success) {
                toast.success(data.message);
                navigate('/');
                dispatch(showAuthForm('tutor'));
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setIsResetting(false);
        }
    }

    return (
        <Container className="mt-20 min-h-[70vh] flex items-center justify-center">
            <section className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 bg-white px-6 sm:px-8 md:px-10 py-10 rounded-md drop-shadow-xl drop-shadow-blue-300 border-2 border-blue-100 relative flex overflow-hidden">
                <form onSubmit={handleSubmit(resetPasswordHandler)} className="w-full">
                    <h3 className="text-2xl text-center mb-3 text-blue-950">Tutor Reset Password</h3>

                    <div className="text-gray-600 grid grid-cols-1 my-2">
                        <label className="flex items-center gap-1" htmlFor="newPassword">
                            <Lock size={18} />
                            <span>New Password</span>
                        </label>

                        <div className="relative">
                            <input 
                                id="newPassword" 
                                type={`${showPassword ? 'text' : 'password'}`} 
                                placeholder="Enter new password" 
                                className="text-black border-2 border-blue-100 py-1 px-2 focus-within:outline-2 focus-within:outline-blue-200 rounded my-1 w-full" 
                                {...register('newPassword', { 
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })} 
                            />
                            <span 
                                onClick={() => setShowPassword(!showPassword)} 
                                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                            >
                                {showPassword ? <EyeIcon size={18} /> : <EyeOff size={18} />}
                            </span>
                        </div>
                    </div>

                    <button 
                        className="w-full bg-blue-600 py-2 text-white rounded cursor-pointer my-2 font-light hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                        type="submit"
                        disabled={isResetting}
                    >
                        {isResetting ? (
                            <span className="flex space-x-1 items-center justify-center py-2">
                                <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                                <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.1s]"></span>
                                <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"></span>
                            </span>
                        ) : (
                            'Reset Password'
                        )}
                    </button>

                    <p className="text-sm text-gray-600 text-center mt-4">
                        Remember your password?{' '}
                        <span 
                            className="text-blue-600 cursor-pointer hover:text-blue-800 underline"
                            onClick={() => {
                                dispatch(toggleShowUserAuthForm(true));
                                navigate('/');
                            }}
                        >
                            Tutor Login
                        </span>
                    </p>
                </form>
            </section>
        </Container>
    );
}

export default TutorResetPassword;