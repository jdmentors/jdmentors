import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import { Mail } from "lucide-react";

function ForgotPasswordForm({isLoginActive, setIsLoginActive, isForgotPasswordActive, setIsForgotPasswordActive}){

    const user = useSelector(state => state.user.user);

    const {register, handleSubmit} = useForm({defaultValues: {
        email:user.email || ''
    }});

    const forgotPasswordHandler = async (formData) => {
        try {
            console.log(formData);
            // const { data } = await axios.post('/api/v1/users/forgot-password', {email:formData.email});

            // if(data.success){
            //     toast.success(data.message);
            // }
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message);
        }
    }

    return (
        <section className={`w-1/2 my-5 ${!isForgotPasswordActive && '-translate-x-10'}`}>
            <form onSubmit={handleSubmit(forgotPasswordHandler)}>
                <h3 className="text-2xl text-center mb-3 text-blue-950">Forgot Password</h3>

                <div className="text-gray-600 grid grid-cols-1 my-2">
                    <label className="flex items-center gap-1" htmlFor='forgotEmail'><Mail size={18} /> <span>Email</span></label>
                    <input id="forgotEmail" type="email" placeholder="E-mail" className="text-black border-2 border-blue-100 py-1 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" {...register('email', {required:true})} />
                </div>

                <p className="text-blue-600 text-sm underline font-light cursor-pointer inline float-right" onClick={() => {setIsLoginActive(true); setIsForgotPasswordActive(false);}}>
                    Remember Password?
                </p>

                <button className="w-full bg-blue-600 py-2 text-white rounded cursor-pointer my-2 font-light" type="submit">Send Reset Link</button>

                <p className="text-sm font-light text-gray-600">Don't have an account? <span to="" className="underline text-blue-500 cursor-pointer" onClick={() => {setIsLoginActive(false); setIsForgotPasswordActive(false);}}>Sign up</span></p>

                <button className="w-full mt-5 bg-blue-950 py-2 text-white rounded cursor-pointer my-2 font-light">Continue as Guest</button>
            </form>
        </section>
    );
}

export default ForgotPasswordForm;