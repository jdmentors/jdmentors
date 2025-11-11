import { CalendarCheck, Shield } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toggleShowUserAuthForm } from "../features/forms/UserAuthSlice.js";

function CallToActionLSATTutoring() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isUserLoggedIn = useSelector(state => state.user.isUserLoggedIn);

    const handleClick = () => {
        try {
            if (isUserLoggedIn) {
                navigate(`/checkout/lsat-session?type=free`);
            } else {
                dispatch(toggleShowUserAuthForm(true));
                navigate(`/checkout/lsat-session?type=free`);
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
                    The LSAT is the Gatekeeper. We're Your Key.
                    <br />
                    — Unlock a Higher Score with a Personalized Game Plan
                </h2>
                <p className="text-gray-400 mt-2 max-w-5xl max-md:text-sm">
                    We provide the master plan, expert guidance, and proven materials to construct the LSAT score that gets you into your dream school.
                </p>

                <div className="flex gap-3 flex-wrap items-center justify-center my-4">
                    <button onClick={handleClick} type="button" className="inline-flex items-center justify-center gap-1 text-white whitespace-nowrap rounded-md font-medium h-12 px-8 bg-blue-600 hover:bg-blue-700 cursor-pointer">
                        <CalendarCheck strokeWidth={1.5} />
                        Book A Free Consultation
                    </button>
                </div>

                <p className="text-gray-400 mt-2 max-w-5xl max-md:text-sm">
                    Your Personal Mentor • Proven Framework • Build a Competitive Score
                </p>
            </div>
        </section>
    );
}

export default CallToActionLSATTutoring;