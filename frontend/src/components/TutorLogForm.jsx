import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { EyeIcon, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toggleIsUserLoggedIn, toggleShowUserAuthForm, updateUser } from "../features/forms/UserAuthSlice.js";

function TutorLogForm({ isLoginActive, setIsLoginActive, isForgotPasswordActive, setIsForgotPasswordActive }) {

    const { register, handleSubmit } = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = useState(false);
    const [isLogging, setIsLogging] = useState(false);

    const loginHandler = async (loginData) => {
        try {
            setIsLogging(true);
            const {data} = await axios.post(
                `${import.meta.env.VITE_DOMAIN_URL}/api/v1/tutors/login`, 
                {
                    email: loginData.email, 
                    password: loginData.password, 
                    userType: 'tutor'
                },
                { withCredentials: true }
            );

            if(data && data.success){
                const accessToken = data.data.accessToken;
                const refreshToken = data.data.refreshToken;
                dispatch(toggleIsUserLoggedIn(true));
                dispatch(toggleShowUserAuthForm(false));
                dispatch(updateUser({...data.data.tutor, accessToken, refreshToken}));
                toast.success(data.message);
                setIsLogging(false);
                navigate('/tutor/dashboard');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Login failed');
            setIsLogging(false);
        }
    }

    return (
        <section className={`w-1/2 my-5 ${!isLoginActive && '-translate-x-10'} ${isForgotPasswordActive && 'translate-x-10'}`}>
            <form onSubmit={handleSubmit(loginHandler)}>
                <h3 className="text-2xl text-center text-blue-950 mb-3">Tutor Login</h3>

                <div className="text-gray-600 grid grid-cols-1 my-2">
                    <label className="flex items-center gap-1" htmlFor='tutorLogEmail'>
                        <Mail size={18} /> <span>Email</span>
                    </label>
                    <input 
                        id="tutorLogEmail" 
                        type="email" 
                        placeholder="E-mail" 
                        className="text-black border-2 border-blue-100 py-1 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200 w-full" 
                        {...register('email', { required: true })} 
                    />
                </div>

                <div className="text-gray-600 grid grid-cols-1 my-2">
                    <label className="flex items-center gap-1" htmlFor='tutorLogPassword'>
                        <Lock size={18} /> <span>Password</span>
                    </label>
                    <div className="relative">
                        <input 
                            id="tutorLogPassword" 
                            type={`${showPassword ? 'text' : 'password'}`} 
                            placeholder="Password" 
                            className="text-black border-2 border-blue-100 py-1 px-2 focus-within:outline-2 focus-within:outline-blue-200 rounded my-1 w-full" 
                            {...register('password', { required: true })} 
                        />
                        <span 
                            onClick={() => setShowPassword(!showPassword)} 
                            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                        >
                            {showPassword ? <EyeIcon size={18} /> : <EyeOff size={18} />}
                        </span>
                    </div>
                </div>

                <p 
                    className="text-blue-600 text-sm underline font-light cursor-pointer inline float-right" 
                    onClick={() => { setIsLoginActive(false); setIsForgotPasswordActive(true); }}
                >
                    Forgot Password?
                </p>

                <button 
                    className="w-full bg-blue-600 py-2 text-white rounded cursor-pointer my-2 font-light" 
                    type="submit"
                >
                    {
                        !isLogging ? 'Login as Tutor' :
                            (<span className="flex space-x-1 items-center justify-center py-2">
                                <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                                <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.1s]"></span>
                                <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"></span>
                            </span>)
                    }
                </button>

                <p className="text-sm font-light text-gray-600">
                    Don't have an account? <span className="underline text-blue-500 cursor-pointer" onClick={() => setIsLoginActive(false)}>Register Now</span>
                </p>
            </form>
        </section>
    );
}

export default TutorLogForm;