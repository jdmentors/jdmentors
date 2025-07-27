import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { EyeIcon, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";

function UserLogForm({isLoginActive, setIsLoginActive, isForgotPasswordActive, setIsForgotPasswordActive}){

    const {register, handleSubmit} = useForm({defaultValues:{
        email:'',
        password:''
    }})

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const loginHandler = async (loginData) => {
        try {
            console.log(loginData);
            // const {data} = await axios.post('/api/v1/users/login', {email:loginData.email, password:loginData.password});

            // if(data){
            //     const accessToken = data.data.accessToken;
            //     dispatch(toggleIsUserLoggedIn(true));
            //     dispatch(toggleShowUserAuthForm(false));
            //     if(data.hotel){
            //         dispatch(updateHotel(data.hotel));
            //         dispatch(toggleIsHotelOwner(true));
            //     }
            //     dispatch(updateUser({...data.data.user, accessToken}));
            //     toast.success(data.message);
            //     navigate('/user/dashboard');
            // }
        } catch (error) {
            console.error(error.message);
            toast.error(error.response.data.message);
        }
    }

    return (
        <section className={`w-1/2 my-5 ${!isLoginActive && '-translate-x-10'} ${isForgotPasswordActive && 'translate-x-10'}`}>
            <form onSubmit={handleSubmit(loginHandler)}>
                <h3 className="text-2xl text-center text-blue-950 mb-3">Login</h3>

                <div className="text-gray-600 grid grid-cols-1 my-2">
                    <label className="flex items-center gap-1" htmlFor='logEmail'><Mail size={18} /> <span>Email</span></label>
                    <input id="logEmail" type="email" placeholder="E-mail" className="text-black border-2 border-blue-100 py-1 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" {...register('email', {required:true})} />
                </div>

                <div className="text-gray-600 grid grid-cols-1 my-2">
                    <label className="flex items-center gap-1" htmlFor='logPassword'><Lock size={18} /> <span>Password</span></label>
                    <div className="relative">
                        <input id="logPassword" type={`${showPassword? 'text' : 'password'}`} placeholder="Password" className="text-black border-2 border-blue-100 py-1 px-2 focus-within:outline-2 focus-within:outline-blue-200 rounded my-1 w-full" {...register('password', {required:true})} />
                        <span onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
                            {
                                showPassword ? <EyeIcon size={18} /> : <EyeOff size={18} />
                            }
                        </span>
                    </div>
                </div>

                <p className="text-blue-600 text-sm underline font-light cursor-pointer inline float-right" onClick={() => {setIsLoginActive(false); setIsForgotPasswordActive(true);}}>
                    Forgot Password?
                </p>

                <button className="w-full bg-blue-600 py-2 text-white rounded cursor-pointer my-2 font-light" type="submit">Login</button>

                <p className="text-sm font-light text-gray-600">Don't have an account? <span to="" className="underline text-blue-500 cursor-pointer" onClick={() => setIsLoginActive(false)}>Sign up</span></p>

                <button className="w-full mt-5 bg-blue-950 py-2 text-white rounded cursor-pointer my-2 font-light">Continue as Guest</button>
            </form>
        </section>
    );
}

export default UserLogForm;