// components/LSATPackageCard.jsx
import { CalendarCheck2, Check, Clock, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { showAuthForm } from "../features/forms/UserAuthSlice.js";

function LSATPackageCard({ _id, title, description, sessions, price, originalPrice, discount, duration, features }) {
    const dispatch = useDispatch();
    const isUserLoggedIn = useSelector(state => state.user.isUserLoggedIn);
    const navigate = useNavigate();

    const handlePurchase = () => {
        try {
            if (isUserLoggedIn) {
                navigate(`/checkout/lsat-package/${_id}`);
            } else {
                dispatch(showAuthForm('user'));
                navigate(`/checkout/lsat-package/${_id}`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="bg-white rounded-xl overflow-hidden border border-blue-100 shadow-lg shadow-blue-100 transition duration-300 hover:shadow-xl hover:shadow-blue-200 flex flex-col h-full">
            <div className="p-6 flex flex-col flex-1">
                {/* Header */}
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-blue-950 mb-2">{title}</h3>
                    <p className="text-gray-600 text-sm">{description}</p>
                </div>

                {/* Sessions Count */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                        <Users className="text-blue-600" size={20} />
                        <span className="text-lg font-semibold text-blue-900">
                            {sessions} Session{sessions > 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                {/* Features */}
                <div className="mb-6 flex-1">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">What's Included:</h4>
                    <ul className="space-y-2">
                        {features.slice(0, 4).map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-sm text-gray-700">{feature}</span>
                            </li>
                        ))}
                        {features.length > 4 && (
                            <li className="text-sm text-blue-600">
                                + {features.length - 4} more features
                            </li>
                        )}
                    </ul>
                </div>

                {/* Duration */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                    <Clock size={16} />
                    <span>Valid for {duration}</span>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                    {originalPrice && originalPrice > price ? (
                        <div className="space-y-1">
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-2xl font-bold text-blue-900">${price}</span>
                                <span className="text-lg text-gray-500 line-through">${originalPrice}</span>
                            </div>
                            {discount > 0 && (
                                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                    Save {discount}%
                                </span>
                            )}
                        </div>
                    ) : (
                        <div className="text-2xl font-bold text-blue-900">${price}</div>
                    )}
                    <p className="text-sm text-gray-600 mt-1">
                        ${(price / sessions).toFixed(2)} per session
                    </p>
                </div>

                {/* Purchase Button */}
                <button
                    onClick={handlePurchase}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors cursor-pointer mt-auto"
                >
                    <CalendarCheck2 size={20} />
                    Purchase Package
                </button>
            </div>
        </div>
    );
}

export default LSATPackageCard;