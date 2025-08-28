import { AdminContainer, AdminSidebar, LoadingSpinner } from "../../components";
import { Pencil, Plus, Trash } from "lucide-react";
import { user } from "../../assets";
import { Link } from "react-router";
import { useState } from "react";
import useGetAllServices from "../../hooks/useGetAllServices";
import { useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import useRefreshToken from "../../hooks/useRefreshToken"
import { updateUser } from "../../features/forms/UserAuthSlice.js";

function AllServices() {
    const [allServices, setAllServices] = useState(null);
    const getAllServices = useGetAllServices();
    const user = useSelector(state => state.user.user);
    const refreshAccessToken = useRefreshToken();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllServices = async () => {
            setAllServices(await getAllServices());
        }
        fetchAllServices();
    }, [])

    const handleDeleteService = async (id) => {
        try {
            const { data } = await axios.delete(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/services/delete/${id}`, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data && data.success) {
                toast.success(data.message);
                setAllServices(prevServices => prevServices.filter(service => service._id.toString() !== id.toString()));
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.delete(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/services/delete/${id}`, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        toast.success(data.message);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                        setAllServices(prevServices => prevServices.filter(service => service._id.toString() !== id.toString()));
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
            const { data } = await axios.patch(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/services/availability/${id}`, { status: availabilityStatus }, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data && data.success) {
                toast.success(data.message);
                setAllServices(services => {
                    return services.map(service => {
                        if (service._id.toString() === id.toString()) {
                            return { ...service, status: availabilityStatus }
                        } else {
                            return service;
                        }
                    })
                })
            }
        } catch (error) {
            const message = error?.response?.data?.message;

            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.patch(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/services/availability/${id}`, { status: availabilityStatus }, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        toast.success(data.message);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                        setAllServices(services => {
                            return services.map(service => {
                                if (service._id.toString() === id.toString()) {
                                    return { ...service, status: availabilityStatus }
                                } else {
                                    return service;
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">All Services</h2>
                    <p className="text-gray-600">Stay in control of offerings and pricing across your platform and manage all service packages at a glance.</p>

                    <br />

                    <Link className="bg-blue-600 py-3 px-6 rounded-md text-white cursor-pointer sm:absolute sm:right-0 sm:top-0 flex items-center gap-2 justify-start max-w-max" to="/admin/services/add"><Plus size={18} strokeWidth={3} /><span>Add Service</span></Link>
                </div>

                <div className="my-10 max-w-full">
                    <div className="overflow-hidden rounded-2xl border-2 border-blue-100 bg-white px-4 pb-3 pt-4 sm:px-6">
                        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">All Services</h3>
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
                                allServices
                                ?
                                (
                                    <>
                                        <div className="hidden sm:block">
                                            {
                                                allServices.map(service => (
                                                    <div key={service._id} className="md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-5 items-center py-5 text-gray-600">
                                                        <p className="text-gray-600">{service.title}</p>

                                                        <p className="">
                                                            ${service.price}
                                                        </p>

                                                        <p>{service.sessionCount}</p>
                                                        <p>${service.totalRevenue}</p>
                                                        <label className="relative cursor-pointer">
                                                            <input type="checkbox" checked={service.status} onChange={(e) => handleUpdateAvailability(service._id, e)} className="sr-only peer" />

                                                            <div className="w-12 h-7 peer-checked:bg-blue-600 bg-blue-200 border border-blue-200 rounded-full transition-colors duration-200"></div>

                                                            <span className="h-5 w-5 bg-white rounded-full absolute top-1/2 -translate-y-1/2 peer-checked:translate-x-full mx-1 transition duration-200"></span>
                                                        </label>


                                                        <div className="flex gap-3">
                                                            <Link to={`/admin/services/edit/${service._id}`} className="bg-green-600 px-4 py-3 rounded-md text-white max-w-max cursor-pointer"><Pencil size={18} /></Link>
                                                            <button onClick={() => handleDeleteService(service._id)} className="bg-red-600 px-4 py-3 rounded-md text-white max-w-max cursor-pointer"><Trash size={18} /></button>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <div className="sm:hidden">
                                            {
                                                allServices.map(service => (
                                                    <div key={service._id} className="flex flex-col gap-3 py-5 text-gray-600 border-b-2 border-b-blue-100">
                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Title:</p>
                                                            <p className="text-gray-600">{service.title}</p>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Rate:</p>
                                                            <p>
                                                                ${service.price}/hr
                                                            </p>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Sessions:</p>
                                                            <p>{service.sessionCount}</p>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Revenue:</p>
                                                            <p>${service.totalRevenue}</p>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Availability:</p>
                                                            <label className="relative cursor-pointer">
                                                                <input type="checkbox" checked={service.status} onChange={(e) => handleUpdateAvailability(service._id, e)} className="sr-only peer" />

                                                                <div className="w-12 h-7 peer-checked:bg-blue-600 bg-blue-200 border border-blue-200 rounded-full transition-colors duration-200"></div>

                                                                <span className="h-5 w-5 bg-white rounded-full absolute top-1/2 -translate-y-1/2 peer-checked:translate-x-full mx-1 transition duration-200"></span>
                                                            </label>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Actions:</p>

                                                            <div className="flex flex-wrap gap-4">
                                                                <Link to={`/admin/services/edit/${service._id}`} className="bg-green-600 px-3 py-1 rounded-md text-white max-w-max cursor-pointer">Edit</Link>
                                                                <button onClick={() => handleDeleteService(service._id)} className="bg-red-600 px-3 py-1 rounded-md text-white max-w-max cursor-pointer">Delete</button>
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

export default AllServices;