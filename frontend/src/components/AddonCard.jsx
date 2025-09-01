import { CalendarCheck2, Plus, Puzzle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toggleShowUserAuthForm } from "../features/forms/UserAuthSlice.js";

function AddonCard({ _id, title, description, price }) {
    const dispatch = useDispatch();
    const isUserLoggedIn = useSelector(state => state.user.isUserLoggedIn);
    const navigate = useNavigate();

    const handleClick = () => {
        try {
            if (isUserLoggedIn) {
                navigate(`/checkout/addon/${_id}`);
            } else {
                dispatch(toggleShowUserAuthForm(true));
                navigate(`/checkout/addon/${_id}`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="addon-card bg-white rounded-xl overflow-hidden shadow-lg shadow-blue-200 border border-blue-100 transition duration-300 flex flex-col">
            <div className="p-6 flex flex-col flex-1">
                {/* Top section */}
                <div>
                    <div className="flex items-center mb-4">
                        <div className="bg-blue-100 p-2.5 rounded-full mr-4 w-10 h-10 flex items-center justify-center">
                            <Plus className="text-blue-600 flex-shrink-0" />
                        </div>
                        <h3 className="text-lg font-semibold text-blue-950">{title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{description}</p>
                </div>

                {/* Bottom section (pushed down) */}
                <div className="mt-auto pt-4 border-t border-gray-200">
                    <p className="text-gray-900 flex justify-between"><span>Price:</span><span className="text-lg font-bold">${price}</span></p>
                    <button
                        onClick={handleClick}
                        className="mt-4 w-full flex gap-1 items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <CalendarCheck2 size={18} /> Book Now
                    </button>
                </div>
            </div>
        </div>

    );
}

export default AddonCard;