import { CalendarCheck2, Check, UserCheck2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toggleShowUserAuthForm } from "../features/forms/UserAuthSlice";

function ServiceCard({_id, title, description, features, price, process}) {
    const dispatch = useDispatch();
    const isUserLoggedIn = useSelector(state => state.user.isUserLoggedIn);
    const navigate = useNavigate();

    const handleClick = () => {
        try {
            if(isUserLoggedIn){
                navigate(`/checkout/${_id}`);
            }else{
                dispatch(toggleShowUserAuthForm(true));
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="service-card bg-white rounded-xl overflow-hidden shadow-lg shadow-blue-200 border border-blue-100 transition duration-300">
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-2.5 rounded-full mr-4 w-10 h-10 flex items-center justify-center">
                        <UserCheck2 className="text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-blue-950">{title}</h3>
                </div>
                <p className="text-gray-600 mb-4">
                    {description}
                </p>
                <ul className="text-gray-600 space-y-2 mb-6">
                    {
                        features.map(offer => (
                            <li key={offer} className="flex items-start gap-1">
                                <Check className="text-blue-600" size={18} />
                                <span>{offer}</span>
                            </li>
                        ))
                    }
                </ul>
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-lg font-bold text-gray-900">${price}/hour</p>
                    <p className="text-sm text-gray-600 mt-1">
                        Process: {process}
                    </p>
                    <button
                        onClick={handleClick}
                        to="/"
                        className="mt-4 w-full flex gap-1 items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <CalendarCheck2 size={18} /> Book Now
                    </button>
                </div>
            </div>
        </div>

    );
}

export default ServiceCard;