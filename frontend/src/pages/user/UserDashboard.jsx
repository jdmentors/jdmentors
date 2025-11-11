import { useEffect } from "react";
import { LoadingSpinner, UserContainer, UserSidebar } from "../../components";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Calendar, Check, Clock, FileDownIcon } from "lucide-react";
import { Link } from "react-router";
import useRefreshToken from "../../hooks/useRefreshToken";
import { updateUser } from "../../features/forms/UserAuthSlice.js";
import cleanFileName from "../../hooks/CleanFileName.jsx";

function UserDashboard() {
    const user = useSelector(state => state.user.user);
    const [userSessions, setUserSessions] = useState(null);
    const [userAccommodations, setUserAccommodations] = useState(null);
    const [userLsatSessions, setUserLsatSessions] = useState(null);
    const dispatch = useDispatch();
    const refreshAccessToken = useRefreshToken();
    const [userPackages, setUserPackages] = useState(null);

    useEffect(() => {
        const getUserPackages = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-packages/user/${user.email}`, {
                    headers: { Authorization: `Bearer ${user.accessToken}` }
                });

                if (data.success) {
                    setUserPackages(data.data);
                }
            } catch (error) {
                const message = error?.response?.data?.message;
                if (message === 'accessToken') {
                    try {
                        const newAccessToken = await refreshAccessToken();

                        const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-packages/user/${user.email}`, {
                            headers: { Authorization: `Bearer ${newAccessToken}` }
                        });

                        if (data && data.success) {
                            dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                            setUserPackages(data.data);
                        }
                    } catch (error) {
                        const message = error?.response?.data?.message;
                        toast.error(message);
                    }
                } else {
                    toast.error(message);
                }
            }
        }
        getUserPackages();
    }, [])

    useEffect(() => {
        const getUserSessions = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/sessions/user`, { headers: { Authorization: `Bearer ${user.accessToken}` } });

                if (data.success) {
                    setUserSessions(data.data);
                }
            } catch (error) {
                const message = error?.response?.data?.message;
                if (message === 'accessToken') {
                    try {
                        const newAccessToken = await refreshAccessToken();

                        const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/sessions/user`, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                        if (data && data.success) {
                            dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                            setUserSessions(data.data);
                        }
                    } catch (error) {
                        const message = error?.response?.data?.message;
                        toast.error(message);
                    }
                } else {
                    toast.error(message);
                }
            }
        }
        getUserSessions();

        const getUserAccommodations = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/accommodations/user`, { headers: { Authorization: `Bearer ${user.accessToken}` } });

                if (data.success) {
                    setUserAccommodations(data.data);
                }
            } catch (error) {
                const message = error?.response?.data?.message;
                if (message === 'accessToken') {
                    try {
                        const newAccessToken = await refreshAccessToken();

                        const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/accommodations/user`, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                        if (data && data.success) {
                            dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                            setUserAccommodations(data.data);
                        }
                    } catch (error) {
                        const message = error?.response?.data?.message;
                        toast.error(message);
                    }
                } else {
                    toast.error(message);
                }
            }
        }
        getUserAccommodations();
    }, [])

    useEffect(() => {
        const getUserLsatSessions = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-sessions/user`, { headers: { Authorization: `Bearer ${user.accessToken}` } });

                if (data.success) {
                    setUserLsatSessions(data.data);
                }
            } catch (error) {
                const message = error?.response?.data?.message;
                if (message === 'accessToken') {
                    try {
                        const newAccessToken = await refreshAccessToken();

                        const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-sessions/user`, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                        if (data && data.success) {
                            dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                            setUserLsatSessions(data.data);
                        }
                    } catch (error) {
                        const message = error?.response?.data?.message;
                        toast.error(message);
                    }
                } else {
                    toast.error(message);
                }
            }
        }
        getUserLsatSessions();
    }, [])

    const getSessionTypeDisplay = (type) => {
        switch (type) {
            case 'free': return 'Free Consultation';
            case 'one-on-one': return '1-on-1 Tutoring';
            case 'class': return 'Group Class';
            default: return type;
        }
    };

    const getSessionDuration = (type) => {
        switch (type) {
            case 'free': return '30 minutes';
            case 'one-on-one': return '60 minutes';
            case 'class': return '60 minutes';
            default: return '';
        }
    };

    const getExpiryStatus = (expiresAt) => {
        const now = new Date();
        const expiryDate = new Date(expiresAt);
        const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

        if (daysUntilExpiry < 0) return { status: 'expired', text: 'Expired', color: 'text-red-600', bg: 'bg-red-100' };
        if (daysUntilExpiry <= 7) return { status: 'soon', text: `Expires in ${daysUntilExpiry} days`, color: 'text-orange-600', bg: 'bg-orange-100' };
        if (daysUntilExpiry <= 30) return { status: 'warning', text: `Expires in ${daysUntilExpiry} days`, color: 'text-yellow-600', bg: 'bg-yellow-100' };
        return { status: 'valid', text: `Valid for ${daysUntilExpiry} days`, color: 'text-green-600', bg: 'bg-green-100' };
    };

    return (
        <section className="flex min-h-[70vh]">
            <UserSidebar />

            <UserContainer>
                <div className="max-w-full">
                    <h2 className="text-3xl md:text-4xl font-bold my-5 text-blue-950">Dashboard</h2>
                    <p className="text-gray-600">Easily track your consultations and documents in one place.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 my-8">
                    {/* Total Sessions Card */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-900 font-semibold">Total Sessions</p>
                                <p className="text-3xl font-bold text-blue-700">
                                    {(userSessions?.length || 0) + (userAccommodations?.length || 0) + (userLsatSessions?.length || 0)}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Calendar className="text-blue-600" />
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Sessions Card */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-900 font-semibold">Upcoming Sessions</p>
                                <p className="text-3xl font-bold text-green-700">
                                    {userLsatSessions?.filter(session =>
                                        new Date(session.dateTime) > new Date() && !session.sessionCompleted
                                    ).length || 0}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <Clock className="text-green-600" />
                            </div>
                        </div>
                    </div>

                    {/* Completed Sessions Card */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-900 font-semibold">Completed Sessions</p>
                                <p className="text-3xl font-bold text-purple-700">
                                    {(userSessions?.filter(session => session.status).length || 0) +
                                        (userAccommodations?.filter(accommodation => accommodation.status).length || 0) +
                                        (userLsatSessions?.filter(session => session.sessionCompleted).length || 0)}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full">
                                <Check className="text-purple-600" size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Add this card to your existing stats grid */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-900 font-semibold">Active Packages</p>
                                <p className="text-3xl font-bold text-orange-700">
                                    {userPackages?.length || 0}
                                </p>
                                <p className="text-sm text-orange-700 mt-1">
                                    {userPackages?.reduce((total, pkg) => total + pkg.sessionsRemaining, 0) || 0} sessions available
                                </p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-full">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* My LSAT Packages Section */}
                <div className="my-10 max-w-full">
                    <div className="overflow-hidden rounded-2xl border-2 border-blue-100 bg-white px-4 pb-3 pt-4 sm:px-6">
                        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">My LSAT Packages</h3>
                            <p className="text-sm text-gray-600">
                                {userPackages ? `${userPackages.length} active package${userPackages.length !== 1 ? 's' : ''}` : 'Loading packages...'}
                            </p>
                        </div>

                        <div className="my-5">
                            {
                                userPackages
                                    ?
                                    (
                                        userPackages.length > 0
                                            ?
                                            (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {
                                                        userPackages.map(pkg => {
                                                            const expiryStatus = getExpiryStatus(pkg.expiresAt);
                                                            return (
                                                                <div key={pkg._id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                                                                    {/* Package Header */}
                                                                    <div className="flex justify-between items-start mb-4">
                                                                        <h4 className="text-lg font-bold text-blue-900">
                                                                            {pkg.package?.title}
                                                                        </h4>
                                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${expiryStatus.bg} ${expiryStatus.color}`}>
                                                                            {expiryStatus.text}
                                                                        </span>
                                                                    </div>

                                                                    {/* Package Details */}
                                                                    <div className="space-y-3 mb-4">
                                                                        <div className="flex justify-between items-center">
                                                                            <span className="text-gray-600">Sessions:</span>
                                                                            <span className="font-semibold">
                                                                                {pkg.sessionsRemaining} / {pkg.sessionsPurchased} remaining
                                                                            </span>
                                                                        </div>

                                                                        <div className="flex justify-between items-center">
                                                                            <span className="text-gray-600">Purchase Date:</span>
                                                                            <span className="text-sm">
                                                                                {new Date(pkg.purchaseDate).toLocaleDateString()}
                                                                            </span>
                                                                        </div>

                                                                        <div className="flex justify-between items-center">
                                                                            <span className="text-gray-600">Expires:</span>
                                                                            <span className="text-sm">
                                                                                {new Date(pkg.expiresAt).toLocaleDateString()}
                                                                            </span>
                                                                        </div>

                                                                        <div className="flex justify-between items-center">
                                                                            <span className="text-gray-600">Price Paid:</span>
                                                                            <span className="font-semibold text-green-600">
                                                                                ${pkg.price}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Progress Bar */}
                                                                    <div className="mb-4">
                                                                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                                            <span>Session Usage</span>
                                                                            <span>{Math.round((pkg.sessionsPurchased - pkg.sessionsRemaining) / pkg.sessionsPurchased * 100)}% used</span>
                                                                        </div>
                                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                                            <div
                                                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                                                style={{
                                                                                    width: `${((pkg.sessionsPurchased - pkg.sessionsRemaining) / pkg.sessionsPurchased) * 100}%`
                                                                                }}
                                                                            ></div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Package Features */}
                                                                    {pkg.package?.features && pkg.package.features.length > 0 && (
                                                                        <div className="mb-4">
                                                                            <p className="text-sm font-medium text-gray-700 mb-2">Features:</p>
                                                                            <ul className="text-sm text-gray-600 space-y-1">
                                                                                {pkg.package.features.slice(0, 3).map((feature, index) => (
                                                                                    <li key={index} className="flex items-center">
                                                                                        <Check size={14} className="text-green-500 mr-2 flex-shrink-0" />
                                                                                        {feature}
                                                                                    </li>
                                                                                ))}
                                                                                {pkg.package.features.length > 3 && (
                                                                                    <li className="text-xs text-gray-500">
                                                                                        +{pkg.package.features.length - 3} more features
                                                                                    </li>
                                                                                )}
                                                                            </ul>
                                                                        </div>
                                                                    )}

                                                                    {/* Action Buttons */}
                                                                    <div className="flex gap-2">
                                                                        <Link
                                                                            to="/lsat-tutoring"
                                                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-3 rounded text-sm font-medium transition-colors"
                                                                        >
                                                                            Book Session
                                                                        </Link>
                                                                        {pkg.sessionsRemaining === 0 && (
                                                                            <span className="flex-1 bg-gray-400 text-white text-center py-2 px-3 rounded text-sm font-medium">
                                                                                All Used
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </div>
                                            )
                                            :
                                            (
                                                <div className="text-center py-8">
                                                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                        </svg>
                                                    </div>
                                                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Packages Yet</h4>
                                                    <p className="text-gray-600 mb-4">You haven't purchased any LSAT packages yet.</p>
                                                    <Link
                                                        to="/lsat-tutoring"
                                                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded font-medium transition-colors"
                                                    >
                                                        Browse Packages
                                                    </Link>
                                                </div>
                                            )
                                    )
                                    :
                                    <LoadingSpinner />
                            }
                        </div>
                    </div>
                </div>
            </UserContainer>
        </section>
    );
}

export default UserDashboard;