import axios from "axios";
import { CalendarCheck, Shield, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toggleShowUserAuthForm } from "../features/forms/UserAuthSlice.js";

function CallToActionAccommodations() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isUserLoggedIn = useSelector(state => state.user.isUserLoggedIn);

    const handleClick = () => {
        try {
            if (isUserLoggedIn) {
                navigate(`/checkout/accommodations`);
            } else {
                dispatch(toggleShowUserAuthForm(true));
                navigate(`/checkout/accommodations`);
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    return (
        <section className="max-w-full bg-gray-900 text-white border-b border-b-gray-800">
            <div className="flex flex-col items-center justify-center text-center py-10 px-2 ">
                <div className="flex items-center justify-center bg-white px-3 py-1.5 shadow gap-1 rounded-full text-xs">
                    <Shield size={18} className="text-blue-950" />
                    <span className="text-blue-950">
                        Trusted by Law Applicants
                    </span>
                </div>
                <h2 className="text-2xl md:text-4xl font-medium my-3">
                    We Make Disability Accommodations Simple
                    <br />
                    — Get Clear, Effective, Step-by-Step Guidance
                </h2>
                <p className="text-gray-400 mt-2 max-w-5xl max-md:text-sm">
                    Receive expert guidance to secure accommodations and manage your symptoms, so you can focus entirely on your exam performance.
                </p>

                <div className="flex gap-3 flex-wrap items-center justify-center my-4">
                    <button onClick={handleClick} type="button" className="inline-flex items-center justify-center gap-1 text-white whitespace-nowrap rounded-md font-medium h-12 px-8 bg-blue-600 hover:bg-blue-700 cursor-pointer">
                        <CalendarCheck strokeWidth={1.5} />
                        Schedule A Consultation
                    </button>
                </div>

                <p className="text-gray-400 mt-2 max-w-5xl max-md:text-sm">
                    Expert Advice • Ask Anything Freely • Fast Response Guaranteed
                </p>
            </div>
        </section>
    );
}

export default CallToActionAccommodations;