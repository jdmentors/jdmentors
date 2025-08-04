import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { EyeIcon, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUser, toggleIsUserLoggedIn, toggleShowUserAuthForm } from "../features/forms/UserAuthSlice.js";

function UserRegForm({isLoginActive, setIsLoginActive}){
    const {register, handleSubmit} = useForm({defaultValues:{
        fullName:'',
        email:'',
        phone:'',
        password:''
    }});

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = useState(false);
    
    const registerFormHandler = async (formData) => {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/users/register`, {fullName:formData.fullName, email:formData.email, phone:formData.phone, password:formData.password}, {withCredentials:true});

            if(data.success){
                const accessToken = data.data.accessToken;
                dispatch(updateUser({...data.data.user, accessToken}));
                dispatch(toggleIsUserLoggedIn(true));
                dispatch(toggleShowUserAuthForm(false));
                navigate('/user/dashboard');
                toast.success(data.message);
            }
        } catch (error) {
            console.error(error.message);
            toast.error(error.response.data.message);
        }
    }

    return (
        <section className={`w-1/2 ${isLoginActive && 'translate-x-10'}`}>
            <form onSubmit={handleSubmit(registerFormHandler)}>
                <h3 className="text-2xl text-center my-5 text-blue-950">Register</h3>

                <div className="text-gray-600 grid grid-cols-1 my-2">
                    <label className="flex items-center gap-1" htmlFor='fullName'><User size={18} /> <span>Full Name</span></label>
                    <input id="fullName" type="text" placeholder="Full Name" className="text-black border-2 border-blue-100 py-1 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" {...register('fullName', {required:true})} />
                </div>

                <div className="text-gray-600 grid grid-cols-1 my-2">
                    <label className="flex items-center gap-1" htmlFor='regEmail'><Mail size={18} /> <span>Email</span></label>
                    <input id="regEmail" type="email" placeholder="E-mail" className="text-black border-2 border-blue-100 py-1 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" {...register('email', {required:true})} />
                </div>

                <div className="text-gray-600 grid grid-cols-1 my-2">
                    <label className="flex items-center gap-1" htmlFor='regPhone'><Phone size={18} /> <span>Phone</span></label>
                    <input id="regPhone" type="tel" placeholder="Phone No." className="text-black border-2 border-blue-100 py-1 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" {...register('phone', {required:true})} />
                </div>

                <div className="text-gray-600 grid grid-cols-1 my-2">
                    <label className="flex items-center gap-1" htmlFor='regPassword'><Lock size={18} /> <span>Password</span></label>
                    <div className="relative">
                        <input id="regPassword" type={`${showPassword? 'text' : 'password'}`} placeholder="Password" className="text-black border-2 border-blue-100 py-1 px-2 focus-within:outline-2 focus-within:outline-blue-200 rounded my-1 w-full" {...register('password', {required:true})} />
                        <span onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
                            {
                                showPassword ? <EyeIcon size={18} /> : <EyeOff size={18} />
                            }
                        </span>
                    </div>
                </div>

                <button className="w-full bg-blue-600 py-2 text-white rounded cursor-pointer my-2 font-light" type="submit">Register</button>

                <p className="text-sm font-light text-gray-600">Already have an account? <span to="" className="underline text-blue-600 cursor-pointer" onClick={() => setIsLoginActive(true)}>Login</span></p>

                <button className="w-full mt-5 bg-blue-950 py-2 text-white rounded cursor-pointer my-2 font-light">Continue as Guest</button>
            </form>
        </section>
    );
}

export default UserRegForm;