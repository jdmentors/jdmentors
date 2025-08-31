import { CalendarCheck2, Gift, Package, Plus, Settings } from "lucide-react";
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
        <div className={`package-card bg-white rounded-xl overflow-hidden border border-blue-100 transition duration-300 flex flex-col relative ${_id == '68b01ac311cd8661cbde73f8' ? 'scale-105 shadow-lg shadow-blue-200' : _id =='68b01b7311cd8661cbde73fe' ? 'drop-shadow-xl drop-shadow-orange-300' : 'shadow-lg shadow-blue-200'} `}>
            {_id == '68b01ac311cd8661cbde73f8' && <p className={`px-3 py-1 text-xs lg:text-base absolute right-1 md:right-2 top-1 md:top-1 rounded bg-white text-blue-600`}>Most Popular</p>}
            {_id == '68b01b7311cd8661cbde73fe' && <p className={`px-3 py-1 text-xs lg:text-base absolute right-1 md:right-2 top-1 md:top-1 rounded bg-white text-yellow-600`}>Ultimate Package</p>}
            <div className={`p-6 flex flex-col flex-1 ${_id == '68b01ac311cd8661cbde73f8' ? 'bg-gradient-to-b from-blue-700  to-blue-400 text-white' : _id == '68b01b7311cd8661cbde73fe' ? 'bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-400' : 'bg-white'}`}>
                {/* Top section */}
                <div>
                    <div className="flex items-center mb-4">
                        <div className={`${_id == '68b01ac311cd8661cbde73f8'? 'bg-white' : _id == '68b01b7311cd8661cbde73fe' ? 'bg-orange-100' : 'bg-blue-100'} p-2.5 rounded-full mr-4 w-10 h-10 flex items-center justify-center`}>
                            <Package className={`text-sm mt-1 ${_id == '68b01b7311cd8661cbde73fe' ? 'text-orange-400' : 'text-blue-600'}`} />
                        </div>
                        <h3 className={`text-xl font-semibold ${_id == '68b01ac311cd8661cbde73f8'? 'text-white' : _id == '68b01b7311cd8661cbde73fe' ? 'text-black' : 'text-blue-950'}`}>{title}</h3>
                    </div>
                    <p className={` mb-4 ${_id == '68b01ac311cd8661cbde73f8'? 'text-white' : _id == '68b01b7311cd8661cbde73fe' ? 'text-black' : 'text-gray-600'}`}>{description}</p>

                    {
                        (services) &&
                        (
                            <div>
                                <p className={` mb-2 font-semibold ${_id == '68b01ac311cd8661cbde73f8'? 'text-white' : _id == '68b01b7311cd8661cbde73fe' ? 'text-black' : 'text-gray-600'}`}>Services:</p>
                                <ul className={` space-y-2 mb-4 ${_id == '68b01ac311cd8661cbde73f8'? 'text-white' : _id == '68b01b7311cd8661cbde73fe' ? 'text-black' : 'text-gray-600'}`}>
                                    {services.map((service) => (
                                        <li key={service} className="flex items-start gap-1">
                                            <Settings className={`text-sm mt-1 ${_id == '68b01ac311cd8661cbde73f8'? 'text-white' :'text-blue-600'}`} size={18} />
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
                                <p className={`mb-2 font-semibold ${_id == '68b01ac311cd8661cbde73f8'? 'text-white' : _id == '68b01b7311cd8661cbde73fe' ? 'text-black' : 'text-gray-600'}`}>Add-ons:</p>
                                <ul className={` space-y-2 mb-4 ${_id == '68b01ac311cd8661cbde73f8'? 'text-white' : _id == '68b01b7311cd8661cbde73fe' ? 'text-black' : 'text-gray-600'}`}>
                                    {addons.map((addon) => (
                                        <li key={addon} className="flex items-start gap-1">
                                            <Plus className={`text-sm mt-1 ${_id == '68b01ac311cd8661cbde73f8'? 'text-white' :'text-blue-600'}`} size={18} />
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
                                <p className={`mb-2 font-semibold ${_id == '68b01ac311cd8661cbde73f8'? 'text-white' : _id == '68b01b7311cd8661cbde73fe' ? 'text-black' : 'text-gray-600'}`}>Extras:</p>
                                <ul className={` space-y-2 mb-6 ${_id == '68b01ac311cd8661cbde73f8'? 'text-white' : _id == '68b01b7311cd8661cbde73fe' ? 'text-black' : 'text-gray-600'}`}>
                                    {extras.map((extra) => (
                                        <li key={extra} className="flex items-start gap-1">
                                            <Gift className={`text-sm mt-1 ${_id == '68b01ac311cd8661cbde73f8'? 'text-white' :'text-blue-600'}`} size={18} />
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
                    <p className={`text-lg font-bold ${_id == '68b01ac311cd8661cbde73f8'? 'text-white' :'text-gray-900'}`}>${price}</p>
                    <p className={`text-sm mt-1 ${_id == '68b01ac311cd8661cbde73f8'? 'text-white' : _id == '68b01b7311cd8661cbde73fe' ? 'text-black' : 'text-gray-600'}`}>Process: {process}</p>
                    <button
                        onClick={handleClick}
                        className={`mt-4 w-full flex gap-1 items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium cursor-pointer  ${_id == '68b01ac311cd8661cbde73f8' ? 'bg-white text-blue-600 hover:bg-blue-50 border-transparent' : _id == '68b01b7311cd8661cbde73fe' ? 'border-black' : 'text-white bg-blue-600 hover:bg-blue-700 border-blue-600'}`}
                    >
                        <CalendarCheck2 size={18} /> Book Now
                    </button>
                </div>
            </div>
        </div>

    );
}

export default PackageCard;