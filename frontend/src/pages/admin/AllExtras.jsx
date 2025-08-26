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
import useGetAllExtras from "../../hooks/useGetAllExtras.jsx";

function AllExtras() {
    const [allExtras, setAllExtras] = useState(null);
    const getAllExtras = useGetAllExtras();
    const user = useSelector(state => state.user.user);
    const refreshAccessToken = useRefreshToken();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllExtras = async () => {
            setAllExtras(await getAllExtras());
        }
        fetchAllExtras();
    }, [])

    const handleDeleteExtra = async (id) => {
        try {
            const { data } = await axios.delete(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/extras/delete/${id}`, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data && data.success) {
                toast.success(data.message);
                setAllExtras(prevExtras => prevExtras.filter(extra => extra._id.toString() !== id.toString()));
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.delete(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/extras/delete/${id}`, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        toast.success(data.message);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                        setAllExtras(prevExtras => prevExtras.filter(extra => extra._id.toString() !== id.toString()));
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
            const { data } = await axios.patch(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/extras/availability/${id}`, { status: availabilityStatus }, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data && data.success) {
                toast.success(data.message);
                setAllExtras(extras => {
                    return extras.map(extra => {
                        if (extra._id.toString() === id.toString()) {
                            return { ...extra, status: availabilityStatus }
                        } else {
                            return extra;
                        }
                    })
                })
            }
        } catch (error) {
            const message = error?.response?.data?.message;

            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.patch(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/extras/availability/${id}`, { status: availabilityStatus }, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        toast.success(data.message);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                        setAllExtras(extras => {
                            return extras.map(extra => {
                                if (extra._id.toString() === id.toString()) {
                                    return { ...extra, status: availabilityStatus }
                                } else {
                                    return extra;
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">All Extras</h2>
                    <p className="text-gray-600">Stay in control of offerings and pricing across your platform and manage all extras at a glance.</p>

                    <br />

                    <Link className="bg-blue-600 py-3 px-6 rounded-md text-white cursor-pointer sm:absolute sm:right-0 sm:top-0 flex items-center gap-2 justify-start max-w-max" to="/admin/extras/add"><Plus size={18} strokeWidth={3} /><span>Create Extra</span></Link>
                </div>

                <div className="my-10 max-w-full">
                    <div className="overflow-hidden rounded-2xl border-2 border-blue-100 bg-white px-4 pb-3 pt-4 sm:px-6">
                        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">All Extras</h3>
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
                                allExtras
                                ?
                                (
                                    <>
                                        <div className="hidden sm:block">
                                            {
                                                allExtras.map(extra => (
                                                    <div key={extra._id} className="md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-5 items-center py-5 text-gray-600">
                                                        <p className="text-gray-600">{extra.title}</p>

                                                        <p className="">
                                                            ${extra.price}
                                                        </p>

                                                        <p>{extra.sessionCount}</p>
                                                        <p>${extra.sessionCount * extra.price}</p>
                                                        <label className="relative cursor-pointer">
                                                            <input type="checkbox" checked={extra.status} onChange={(e) => handleUpdateAvailability(extra._id, e)} className="sr-only peer" />

                                                            <div className="w-12 h-7 peer-checked:bg-blue-600 bg-blue-200 border border-blue-200 rounded-full transition-colors duration-200"></div>

                                                            <span className="h-5 w-5 bg-white rounded-full absolute top-1/2 -translate-y-1/2 peer-checked:translate-x-full mx-1 transition duration-200"></span>
                                                        </label>


                                                        <div className="flex gap-3">
                                                            <Link to={`/admin/extras/edit/${extra._id}`} className="bg-green-600 px-4 py-3 rounded-md text-white max-w-max cursor-pointer"><Pencil size={18} /></Link>
                                                            <button onClick={() => handleDeleteExtra(extra._id)} className="bg-red-600 px-4 py-3 rounded-md text-white max-w-max cursor-pointer"><Trash size={18} /></button>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <div className="sm:hidden">
                                            {
                                                allExtras.map(extra => (
                                                    <div key={extra._id} className="flex flex-col gap-3 py-5 text-gray-600 border-b-2 border-b-blue-100">
                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Title:</p>
                                                            <p className="text-gray-600">{extra.title}</p>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Rate:</p>
                                                            <p>
                                                                ${extra.price}/hr
                                                            </p>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Sessions:</p>
                                                            <p>{extra.sessionCount}</p>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Revenue:</p>
                                                            <p>${extra.sessionCount * extra.price}</p>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Availability:</p>
                                                            <label className="relative cursor-pointer">
                                                                <input type="checkbox" checked={extra.status} onChange={(e) => handleUpdateAvailability(extra._id, e)} className="sr-only peer" />

                                                                <div className="w-12 h-7 peer-checked:bg-blue-600 bg-blue-200 border border-blue-200 rounded-full transition-colors duration-200"></div>

                                                                <span className="h-5 w-5 bg-white rounded-full absolute top-1/2 -translate-y-1/2 peer-checked:translate-x-full mx-1 transition duration-200"></span>
                                                            </label>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Actions:</p>

                                                            <div className="flex flex-wrap gap-4">
                                                                <Link to={`/admin/extras/edit/${extra._id}`} className="bg-green-600 px-3 py-1 rounded-md text-white max-w-max cursor-pointer">Edit</Link>
                                                                <button onClick={() => handleDeleteExtra(extra._id)} className="bg-red-600 px-3 py-1 rounded-md text-white max-w-max cursor-pointer">Delete</button>
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

export default AllExtras;