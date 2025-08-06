import { X } from "lucide-react";
import { ForgotPasswordForm, UserLogForm, UserRegForm } from "./";
import { useState } from "react";
import { toggleShowUserAuthForm } from "../features/forms/UserAuthSlice.js";
import { useDispatch } from "react-redux";

function UserAuth(){
    const [isLoginActive, setIsLoginActive] = useState(true);

    const dispatch = useDispatch();

    const [isForgotPasswordActive, setIsForgotPasswordActive] = useState(false);

    return (
        <section className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-black/80 flex items-center justify-center">
            <div className="w-full mx-5 sm:w-1/2 lg:w-1/3 xl:w-1/4 bg-white px-6 sm:px-8 md:px-10 rounded-md drop-shadow-xl drop-shadow-blue-400 relative flex overflow-hidden">
                <div className={`min-w-[300%] flex items-start transition-all duration-200 my-14 ${(isForgotPasswordActive && !isLoginActive) ? 'translate-x-0 max-h-50' : (!isLoginActive && !isForgotPasswordActive) ? '-translate-x-2/3 max-h-104' : '-translate-x-1/3 max-h-69'}`}>
                    <ForgotPasswordForm isLoginActive={isLoginActive} setIsLoginActive={setIsLoginActive} isForgotPasswordActive={isForgotPasswordActive} setIsForgotPasswordActive={setIsForgotPasswordActive} />

                    <UserLogForm isLoginActive={isLoginActive} setIsLoginActive={setIsLoginActive} isForgotPasswordActive={isForgotPasswordActive} setIsForgotPasswordActive={setIsForgotPasswordActive} />

                    <UserRegForm isLoginActive={isLoginActive} setIsLoginActive={setIsLoginActive} />
                </div>

                <X className="absolute top-5 right-5 cursor-pointer text-gray-600 text-2xl" onClick={() => dispatch(toggleShowUserAuthForm(false))} />

                <div className="absolute top-5 left-1/2 -translate-x-1/2 flex gap-10 text-md">
                    <span className={`cursor-pointer pb-1 ${isLoginActive ? 'text-blue-600 border-b-2 border-b-blue-600': 'text-gray-600'}`} onClick={() => {setIsLoginActive(true); setIsForgotPasswordActive(false);}}>Login</span>
                    <span className={`cursor-pointer pb-1  ${(!isLoginActive && !isForgotPasswordActive) ? 'text-blue-600 border-b-2 border-b-blue-600' : (!isLoginActive && isForgotPasswordActive) ? 'text-gray-600' : 'text-gray-600'}`} onClick={() => {setIsLoginActive(false); setIsForgotPasswordActive(false);}}>Register</span>
                </div>
            </div>
        </section>
    );
}

export default UserAuth;