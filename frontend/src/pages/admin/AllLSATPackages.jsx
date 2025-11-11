import { AdminContainer, AdminSidebar, ClassPricingForm, LoadingSpinner } from "../../components";
import { Pencil, Plus, Trash } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import useGetAllLSATPackages from "../../hooks/useGetAllLSATPackages";
import { useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import useRefreshToken from "../../hooks/useRefreshToken"
import { updateUser } from "../../features/forms/UserAuthSlice.js";

function AllLSATPackages() {
    const [allLSATPackages, setAllLSATPackages] = useState(null);
    const getAllLSATPackages = useGetAllLSATPackages();
    const user = useSelector(state => state.user.user);
    const refreshAccessToken = useRefreshToken();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('packages');

    useEffect(() => {
        const fetchAllLSATPackages = async () => {
            setAllLSATPackages(await getAllLSATPackages());
        }
        fetchAllLSATPackages();
    }, [])

    const handleDeletePackage = async (id) => {
        try {
            const { data } = await axios.delete(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-packages/delete/${id}`, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data && data.success) {
                toast.success(data.message);
                setAllLSATPackages(prevPackages => prevPackages.filter(lsatPackage => lsatPackage._id.toString() !== id.toString()));
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.delete(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-packages/delete/${id}`, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        toast.success(data.message);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                        setAllLSATPackages(prevPackages => prevPackages.filter(lsatPackage => lsatPackage._id.toString() !== id.toString()));
                    }
                } catch (error) {
                    console.error(error?.response?.data?.message);
                }
            }
        }
    }

    const handleUpdateAvailability = async (id, e) => {
        const availabilityStatus = e.target.checked;
        try {
            const { data } = await axios.patch(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-packages/availability/${id}`, { isActive: availabilityStatus }, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data && data.success) {
                toast.success(data.message);
                setAllLSATPackages(packages => {
                    return packages.map(lsatPackage => {
                        if (lsatPackage._id.toString() === id.toString()) {
                            return { ...lsatPackage, isActive: availabilityStatus }
                        } else {
                            return lsatPackage;
                        }
                    })
                })
            }
        } catch (error) {
            const message = error?.response?.data?.message;

            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.patch(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-packages/availability/${id}`, { isActive: availabilityStatus }, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        toast.success(data.message);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                        setAllLSATPackages(packages => {
                            return packages.map(lsatPackage => {
                                if (lsatPackage._id.toString() === id.toString()) {
                                    return { ...lsatPackage, isActive: availabilityStatus }
                                } else {
                                    return lsatPackage;
                                }
                            })
                        })
                    }
                } catch (error) {
                    console.error(error);
                }
            } else {
                toast.error(message);
            }
        }
    }

    return (
        <section className="flex min-h-[90vh]">
            <AdminSidebar />

            <AdminContainer>
                <div className="max-w-full relative">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">All LSAT Packages</h2>
                    <p className="text-gray-600">Manage LSAT tutoring packages, pricing, and availability to offer students flexible learning options.</p>

                    <br />

                    <Link className="bg-blue-600 py-3 px-6 rounded-md text-white cursor-pointer sm:absolute sm:right-0 sm:top-0 flex items-center gap-2 justify-start max-w-max" to="/admin/lsat-packages/add">
                        <Plus size={18} strokeWidth={3} />
                        <span>Add LSAT Package</span>
                    </Link>
                </div>

                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        onClick={() => setActiveTab('packages')}
                        className={`px-4 py-2 font-medium cursor-pointer ${activeTab === 'packages'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        LSAT Packages
                    </button>
                    <button
                        onClick={() => setActiveTab('pricing')}
                        className={`px-4 py-2 font-medium cursor-pointer ${activeTab === 'pricing'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Class Pricing
                    </button>
                </div>

                {activeTab === 'packages' ? (
                    <div className="my-10 max-w-full">
                        <div className="overflow-hidden rounded-2xl border-2 border-blue-100 bg-white px-4 pb-3 pt-4 sm:px-6">
                            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">All LSAT Packages</h3>
                            </div>

                            <div className="my-5 overflow-x-auto">
                                <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-5 items-center py-3 border-b-2 border-b-blue-100">
                                    <h5 className="text-lg">Title</h5>
                                    <h5 className="text-lg">Price</h5>
                                    <h5 className="text-lg">Sessions</h5>
                                    <h5 className="text-lg">Duration</h5>
                                    <h5 className="text-lg">Availability</h5>
                                    <h5 className="text-lg">Action</h5>
                                </div>

                                {
                                    allLSATPackages
                                        ?
                                        (
                                            <>
                                                <div className="hidden sm:block">
                                                    {
                                                        allLSATPackages.map(lsatPackage => (
                                                            <div key={lsatPackage._id} className="md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-5 items-center py-5 text-gray-600 border-b border-blue-100">
                                                                <p className="text-gray-800 font-medium">{lsatPackage.title}</p>

                                                                <p className="text-gray-600">
                                                                    ${lsatPackage.price}
                                                                    {lsatPackage.originalPrice && (
                                                                        <span className="text-gray-400 line-through text-sm ml-1">
                                                                            ${lsatPackage.originalPrice}
                                                                        </span>
                                                                    )}
                                                                </p>

                                                                <p className="text-gray-600">{lsatPackage.sessions}</p>
                                                                <p className="text-gray-600">{lsatPackage.duration}</p>
                                                                <label className="relative cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={lsatPackage.isActive}
                                                                        onChange={(e) => handleUpdateAvailability(lsatPackage._id, e)}
                                                                        className="sr-only peer"
                                                                    />

                                                                    <div className="w-12 h-7 peer-checked:bg-blue-600 bg-blue-200 border border-blue-200 rounded-full transition-colors duration-200"></div>

                                                                    <span className="h-5 w-5 bg-white rounded-full absolute top-1/2 -translate-y-1/2 peer-checked:translate-x-full mx-1 transition duration-200"></span>
                                                                </label>

                                                                <div className="flex gap-3">
                                                                    <Link
                                                                        to={`/admin/lsat-packages/edit/${lsatPackage._id}`}
                                                                        className="bg-green-600 px-4 py-3 rounded-md text-white max-w-max cursor-pointer hover:bg-green-700 transition-colors"
                                                                    >
                                                                        <Pencil size={18} />
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => handleDeletePackage(lsatPackage._id)}
                                                                        className="bg-red-600 px-4 py-3 rounded-md text-white max-w-max cursor-pointer hover:bg-red-700 transition-colors"
                                                                    >
                                                                        <Trash size={18} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                                <div className="sm:hidden">
                                                    {
                                                        allLSATPackages.map(lsatPackage => (
                                                            <div key={lsatPackage._id} className="flex flex-col gap-3 py-5 text-gray-600 border-b-2 border-b-blue-100">
                                                                <div className="flex gap-4">
                                                                    <p className="text-gray-800 font-medium">Title:</p>
                                                                    <p className="text-gray-600">{lsatPackage.title}</p>
                                                                </div>

                                                                <div className="flex gap-4">
                                                                    <p className="text-gray-800 font-medium">Price:</p>
                                                                    <p className="text-gray-600">
                                                                        ${lsatPackage.price}
                                                                        {lsatPackage.originalPrice && (
                                                                            <span className="text-gray-400 line-through text-sm ml-1">
                                                                                ${lsatPackage.originalPrice}
                                                                            </span>
                                                                        )}
                                                                    </p>
                                                                </div>

                                                                <div className="flex gap-4">
                                                                    <p className="text-gray-800 font-medium">Sessions:</p>
                                                                    <p className="text-gray-600">{lsatPackage.sessions}</p>
                                                                </div>

                                                                <div className="flex gap-4">
                                                                    <p className="text-gray-800 font-medium">Duration:</p>
                                                                    <p className="text-gray-600">{lsatPackage.duration}</p>
                                                                </div>

                                                                <div className="flex gap-4 items-center">
                                                                    <p className="text-gray-800 font-medium">Availability:</p>
                                                                    <label className="relative cursor-pointer">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={lsatPackage.isActive}
                                                                            onChange={(e) => handleUpdateAvailability(lsatPackage._id, e)}
                                                                            className="sr-only peer"
                                                                        />

                                                                        <div className="w-12 h-7 peer-checked:bg-blue-600 bg-blue-200 border border-blue-200 rounded-full transition-colors duration-200"></div>

                                                                        <span className="h-5 w-5 bg-white rounded-full absolute top-1/2 -translate-y-1/2 peer-checked:translate-x-full mx-1 transition duration-200"></span>
                                                                    </label>
                                                                </div>

                                                                <div className="flex gap-4">
                                                                    <p className="text-gray-800 font-medium">Actions:</p>

                                                                    <div className="flex flex-wrap gap-4">
                                                                        <Link
                                                                            to={`/admin/edit-lsat-package/${lsatPackage._id}`}
                                                                            className="bg-green-600 px-3 py-2 rounded-md text-white max-w-max cursor-pointer hover:bg-green-700 transition-colors flex items-center gap-1"
                                                                        >
                                                                            <Pencil size={16} />
                                                                            Edit
                                                                        </Link>
                                                                        <button
                                                                            onClick={() => handleDeletePackage(lsatPackage._id)}
                                                                            className="bg-red-600 px-3 py-2 rounded-md text-white max-w-max cursor-pointer hover:bg-red-700 transition-colors flex items-center gap-1"
                                                                        >
                                                                            <Trash size={16} />
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </>
                                        )
                                        :
                                        <LoadingSpinner />
                                }
                            </div>
                        </div>
                    </div>
                ) :
                    <ClassPricingForm />
                }
            </AdminContainer>
        </section>
    );
}

export default AllLSATPackages;