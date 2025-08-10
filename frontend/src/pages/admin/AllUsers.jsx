import { AdminContainer, AdminSidebar } from "../../components";
import { Trash } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import useGetAllUsers from "../../hooks/useGetAllUser";
import { useDispatch, useSelector } from "react-redux";
import useRefreshToken from "../../hooks/useRefreshToken";
import { useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { updateUser } from "../../features/forms/UserAuthSlice.js";

function AllUsers() {
    const [allUsers, setAllUsers] = useState(null);
    const getAllUsers = useGetAllUsers();
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();
    const refreshAccessToken = useRefreshToken();

    useEffect(() => {
        const fetchAllUsers = async () => {
            setAllUsers(await getAllUsers());
        }
        fetchAllUsers();
    }, [])

    const handleDeleteUser = async (id) => {
        try {
            const { data } = await axios.delete(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/users/delete/${id}`, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data && data.success) {
                toast.success(data.message);
                setAllUsers(prevUsers => prevUsers.filter(user => user._id.toString() !== id.toString()));
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.delete(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/users/delete/${id}`, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        toast.success(data.message);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                        setAllUsers(prevUsers => prevUsers.filter(user => user._id.toString() !== id.toString()));
                    }
                } catch (error) {
                    toast.error(error?.response?.data?.message);
                }
            }
        }
    }
    return (
        <section className="flex min-h-[90vh]">
            <AdminSidebar />

            <AdminContainer>
                <div className="max-w-full">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">All Users</h2>
                    <p className="text-gray-600">All your users, one clean view. Efficiently manage profiles and stay informed on every user.</p>
                </div>

                <div className="my-10 max-w-full">
                    <div className="overflow-hidden rounded-2xl border-2 border-blue-100 bg-white px-4 pb-3 pt-4 sm:px-6">
                        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">All Users</h3>
                        </div>

                        <div className="my-5 overflow-x-auto">
                            <div className="hidden sm:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-5 items-center py-3 border-b-2 border-b-blue-100">
                                {/* <h5 className="text-lg">Image</h5> */}
                                <h5 className="text-lg">Name</h5>
                                <h5 className="text-lg">Email</h5>
                                <h5 className="text-lg">Phone</h5>
                                <h5 className="text-lg">Session</h5>
                                <h5 className="text-lg">Spent</h5>
                                <h5 className="text-lg">Member Since</h5>
                                <h5 className="text-lg">Action</h5>
                            </div>

                            {
                                allUsers
                                &&
                                (
                                    <>
                                        <div className="hidden sm:block">
                                            {
                                                allUsers.map(user => (
                                                    <div key={user._id} className="md:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-5 items-center py-5 text-gray-600">
                                                        {/* <img src={user} alt="" className="h-9 w-9 sm:h-12 sm:w-12 object-cover rounded-full border-2 border-blue-100" /> */}

                                                        <p>{user.fullName}</p>

                                                        <Link to={`mailto:${user.email}`} className="text-blue-600 underline">{user.email}</Link>

                                                        <Link to={`tel:${user.phone}`} className="text-blue-600 underline">{user.phone}</Link>

                                                        <p>{user.sessionCount}</p>
                                                        <p>${user.totalSpent}</p>
                                                        <p>{new Date(user.createdAt).toDateString()}</p>

                                                        <button onClick={() => handleDeleteUser(user._id)} className="bg-red-600 px-4 py-3 rounded-md text-white max-w-max cursor-pointer"><Trash /></button>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <div className="sm:hidden">
                                            {
                                                allUsers.map(user => (
                                                    <div key={user._id} className="flex flex-col gap-3 py-5 text-gray-600 border-b-2 border-b-blue-100">
                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Name:</p>
                                                            <p>
                                                                {user.fullName}
                                                            </p>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Email:</p>
                                                            <Link to={`mailto:${user.email}`} className="text-blue-600 underline">{user.email}</Link>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Phone:</p>
                                                            <Link to={`tel:${user.phone}`} className="text-blue-600 underline">{user.phone}</Link>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Sessions:</p>
                                                            <p>12</p>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Spent:</p>
                                                            <p>$840</p>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Member Since:</p>
                                                            <p>July 25, 2025</p>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Actions:</p>

                                                            <button onClick={() => handleDeleteUser(user._id)} className="bg-red-600 px-3 py-1 rounded-md text-white max-w-max cursor-pointer">Delete</button>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
            </AdminContainer>
        </section>
    );
}

export default AllUsers;