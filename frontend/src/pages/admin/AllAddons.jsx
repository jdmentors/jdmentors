import { AdminContainer, AdminSidebar, LoadingSpinner } from "../../components/index.js";
import { Pencil, Plus, Trash } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import useRefreshToken from "../../hooks/useRefreshToken.jsx"
import { updateUser } from "../../features/forms/UserAuthSlice.js";
import useGetAllAddons from "../../hooks/useGetAllAddons.jsx";

function AllAddons() {
    const [allAddons, setAllAddons] = useState(null);
    const getAllAddons = useGetAllAddons();
    const user = useSelector(state => state.user.user);
    const refreshAccessToken = useRefreshToken();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllAddons = async () => {
            setAllAddons(await getAllAddons());
        }
        fetchAllAddons();
    }, [])

    const handleDeleteAddon = async (id) => {
        try {
            const { data } = await axios.delete(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/addons/delete/${id}`, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data && data.success) {
                toast.success(data.message);
                setAllAddons(prevAddons => prevAddons.filter(addon => addon._id.toString() !== id.toString()));
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.delete(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/addons/delete/${id}`, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        toast.success(data.message);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                        setAllAddons(prevAddons => prevAddons.filter(addon => addon._id.toString() !== id.toString()));
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
            const { data } = await axios.patch(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/addons/availability/${id}`, { status: availabilityStatus }, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data && data.success) {
                toast.success(data.message);
                setAllAddons(addons => {
                    return addons.map(addon => {
                        if (addon._id.toString() === id.toString()) {
                            return { ...addon, status: availabilityStatus }
                        } else {
                            return addon;
                        }
                    })
                })
            }
        } catch (error) {
            const message = error?.response?.data?.message;

            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.patch(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/addons/availability/${id}`, { status: availabilityStatus }, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        toast.success(data.message);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                        setAllAddons(addons => {
                            return addons.map(addon => {
                                if (addon._id.toString() === id.toString()) {
                                    return { ...addon, status: availabilityStatus }
                                } else {
                                    return addon;
                                }
                            })
                        })
                    }
                } catch (error) {
                    console.error(error);
                }
            }else{
                toast.error(message);
            }
        }
    }
    return (
        <section className="flex min-h-[90vh]">
            <AdminSidebar />

            <AdminContainer>
                <div className="max-w-full relative">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">All Add-ons</h2>
                    <p className="text-gray-600">Stay in control of offerings and pricing across your platform and manage all add-ons at a glance.</p>

                    <br />

                    <Link className="bg-blue-600 py-3 px-6 rounded-md text-white cursor-pointer sm:absolute sm:right-0 sm:top-0 flex items-center gap-2 justify-start max-w-max" to="/admin/addons/add"><Plus size={18} strokeWidth={3} /><span>Create Add-on</span></Link>
                </div>

                <div className="my-10 max-w-full">
                    <div className="overflow-hidden rounded-2xl border-2 border-blue-100 bg-white px-4 pb-3 pt-4 sm:px-6">
                        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">All Add-ons</h3>
                        </div>

                        <div className="my-5 overflow-x-auto">
                            <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-5 items-center py-3 border-b-2 border-b-blue-100">
                                <h5 className="text-lg">Title</h5>
                                <h5 className="text-lg">Rate</h5>
                                <h5 className="text-lg">Sessions</h5>
                                <h5 className="text-lg">Revenue</h5>
                                <h5 className="text-lg">Availability</h5>
                                <h5 className="text-lg">Action</h5>
                            </div>

                            {
                                allAddons
                                ?
                                (
                                    <>
                                        <div className="hidden sm:block">
                                            {
                                                allAddons.map(addon => (
                                                    <div key={addon._id} className="md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-5 items-center py-5 text-gray-600">
                                                        <p className="text-gray-600">{addon.title}</p>

                                                        <p className="">
                                                            ${addon.price}
                                                        </p>

                                                        <p>{addon.sessionCount}</p>
                                                        <p>${addon.sessionCount * addon.price}</p>
                                                        <label className="relative cursor-pointer">
                                                            <input type="checkbox" checked={addon.status} onChange={(e) => handleUpdateAvailability(addon._id, e)} className="sr-only peer" />

                                                            <div className="w-12 h-7 peer-checked:bg-blue-600 bg-blue-200 border border-blue-200 rounded-full transition-colors duration-200"></div>

                                                            <span className="h-5 w-5 bg-white rounded-full absolute top-1/2 -translate-y-1/2 peer-checked:translate-x-full mx-1 transition duration-200"></span>
                                                        </label>


                                                        <div className="flex gap-3">
                                                            <Link to={`/admin/addons/edit/${addon._id}`} className="bg-green-600 px-4 py-3 rounded-md text-white max-w-max cursor-pointer"><Pencil size={18} /></Link>
                                                            <button onClick={() => handleDeleteAddon(addon._id)} className="bg-red-600 px-4 py-3 rounded-md text-white max-w-max cursor-pointer"><Trash size={18} /></button>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <div className="sm:hidden">
                                            {
                                                allAddons.map(addon => (
                                                    <div key={addon._id} className="flex flex-col gap-3 py-5 text-gray-600 border-b-2 border-b-blue-100">
                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Title:</p>
                                                            <p className="text-gray-600">{addon.title}</p>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Rate:</p>
                                                            <p>
                                                                ${addon.price}/hr
                                                            </p>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Sessions:</p>
                                                            <p>{addon.sessionCount}</p>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Revenue:</p>
                                                            <p>${addon.sessionCount * addon.price}</p>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Availability:</p>
                                                            <label className="relative cursor-pointer">
                                                                <input type="checkbox" checked={addon.status} onChange={(e) => handleUpdateAvailability(addon._id, e)} className="sr-only peer" />

                                                                <div className="w-12 h-7 peer-checked:bg-blue-600 bg-blue-200 border border-blue-200 rounded-full transition-colors duration-200"></div>

                                                                <span className="h-5 w-5 bg-white rounded-full absolute top-1/2 -translate-y-1/2 peer-checked:translate-x-full mx-1 transition duration-200"></span>
                                                            </label>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Actions:</p>

                                                            <div className="flex flex-wrap gap-4">
                                                                <Link to={`/admin/addons/edit/${addon._id}`} className="bg-green-600 px-3 py-1 rounded-md text-white max-w-max cursor-pointer">Edit</Link>
                                                                <button onClick={() => handleDeleteAddon(addon._id)} className="bg-red-600 px-3 py-1 rounded-md text-white max-w-max cursor-pointer">Delete</button>
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
            </AdminContainer>
        </section>
    );
}

export default AllAddons;