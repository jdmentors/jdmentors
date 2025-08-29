import { CalendarCheck2, Gift, Package, Puzzle, Settings } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toggleShowUserAuthForm } from "../features/forms/UserAuthSlice.js";

function PackageCard({ _id, title, description, services = [], addons = [], extras = [], price, process }) {
    const dispatch = useDispatch();
    const isUserLoggedIn = useSelector(state => state.user.isUserLoggedIn);
    const navigate = useNavigate();

    const handleClick = () => {
        try {
            if (isUserLoggedIn) {
                navigate(`/checkout/package/${_id}`);
            } else {
                dispatch(toggleShowUserAuthForm(true));
                navigate(`/checkout/package/${_id}`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="package-card bg-white rounded-xl overflow-hidden shadow-lg shadow-blue-200 border border-blue-100 transition duration-300 flex flex-col relative">
            {_id == '68b01ac311cd8661cbde73f8' && <p className="bg-blue-600 text-white py-1 px-3 text-xs absolute right-4 top-3 rounded">Most Popular</p>}
            <div className="p-6 flex flex-col flex-1">
                {/* Top section */}
                <div>
                    <div className="flex items-center mb-4">
                        <div className="bg-blue-100 p-2.5 rounded-full mr-4 w-10 h-10 flex items-center justify-center">
                            <Package className="text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-blue-950">{title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{description}</p>

                    {
                        (services) &&
                        (
                            <div>
                                <p className="text-gray-600 mb-2 font-semibold">Services:</p>
                                <ul className="text-gray-600 space-y-2 mb-4">
                                    {services.map((service) => (
                                        <li key={service} className="flex items-start gap-1">
                                            <Settings className="text-blue-600" size={18} />
                                            <span>{service}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    }

                    {
                        addons &&
                        (
                            <div>
                                <p className="text-gray-600 mb-2 font-semibold">Add-ons:</p>
                                <ul className="text-gray-600 space-y-2 mb-4">
                                    {addons.map((addon) => (
                                        <li key={addon} className="flex items-start gap-1">
                                            <Puzzle className="text-blue-600" size={18} />
                                            <span>{addon}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    }

                    {
                        extras &&
                        (
                            <div>
                                <p className="text-gray-600 mb-2 font-semibold">Extras:</p>
                                <ul className="text-gray-600 space-y-2 mb-6">
                                    {extras.map((extra) => (
                                        <li key={extra} className="flex items-start gap-1">
                                            <Gift className="text-blue-600" size={18} />
                                            <span>{extra}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    }
                </div>

                {/* Bottom section (pushed down) */}
                <div className="mt-auto pt-4 border-t border-gray-200">
                    <p className="text-lg font-bold text-gray-900">${price}</p>
                    <p className="text-sm text-gray-600 mt-1">Process: {process}</p>
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

export default PackageCard;