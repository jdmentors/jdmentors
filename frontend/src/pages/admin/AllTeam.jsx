import { AdminContainer, AdminSidebar, LoadingSpinner } from "../../components";
import { Plus, Trash, UserPen } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import useGetAllTeams from "../../hooks/useGetAllTeam";
import { useDispatch, useSelector } from "react-redux";
import useRefreshToken from "../../hooks/useRefreshToken";
import { useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { updateUser } from "../../features/forms/UserAuthSlice.js";

function AllTeam() {
    const [allTeam, setAllTeam] = useState(null);
    const getAllTeam = useGetAllTeams();
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();
    const refreshAccessToken = useRefreshToken();

    useEffect(() => {
        const fetchAllTeam = async () => {
            setAllTeam(await getAllTeam());
        }
        fetchAllTeam();
    }, [])

    const handleDeleteTeam = async (id) => {
        try {
            const { data } = await axios.delete(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/team/delete/${id}`, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data && data.success) {
                toast.success(data.message);
                setAllTeam(prevTeam => prevTeam.filter(team => team._id.toString() !== id.toString()));
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.delete(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/team/delete/${id}`, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        toast.success(data.message);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                        setAllTeam(prevTeam => prevTeam.filter(team => team._id.toString() !== id.toString()));
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }

    return (
        <section className="flex min-h-[90vh]">
            <AdminSidebar />

            <AdminContainer>
                <div className="max-w-full relative">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">All Team Members</h2>
                    <p className="text-gray-600">All your team members, one clean view. Efficiently manage profiles and stay informed on every team member.</p>

                    <br />

                    <Link className="bg-blue-600 py-3 px-6 rounded-md text-white cursor-pointer sm:absolute sm:right-0 sm:top-0 flex items-center gap-1 justify-start max-w-max" to="/admin/team/add"><Plus size={18} strokeWidth={3} /><span>Add Member</span></Link>
                </div>

                <div className="my-10 max-w-full">
                    <div className="overflow-hidden rounded-2xl border-2 border-blue-100 bg-white px-4 pb-3 pt-4 sm:px-6">
                        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">All Team Members</h3>
                        </div>

                        <div className="my-5 overflow-x-auto">
                            <div className="hidden sm:grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-5 items-center py-3 border-b-2 border-b-blue-100">
                                <h5 className="text-lg">Image</h5>
                                <h5 className="text-lg">Full Name</h5>
                                <h5 className="text-lg">Designation</h5>
                                <h5 className="text-lg">Update</h5>
                                <h5 className="text-lg">Delete</h5>
                            </div>

                            {
                                allTeam
                                ?
                                (
                                    <>
                                        <div className="hidden sm:block">
                                            {
                                                allTeam.map(team => (
                                                    <div key={team._id} className="md:grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-5 items-center py-5 text-gray-600">
                                                        <img src={team.image} alt="teamImg" className="h-9 w-9 sm:h-14 sm:w-14 object-cover rounded-full border-2 border-blue-100" />

                                                        <p>{team.fullName}</p>

                                                        <p>{team.designation}</p>

                                                        <Link to={`/admin/team/update/${team._id}`} className="bg-green-600 px-4 py-3 rounded-md text-white max-w-max cursor-pointer flex gap-2 items-center"><UserPen /> <span>Update</span></Link>

                                                        <button onClick={() => handleDeleteTeam(team._id)} className="bg-red-600 px-4 py-3 rounded-md text-white max-w-max cursor-pointer flex gap-2 items-center"><Trash /><span>Delete</span></button>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <div className="sm:hidden">
                                            {
                                                allTeam.map(team => (
                                                    <div key={team._id} className="flex flex-col gap-3 py-5 text-gray-600 border-b-2 border-b-blue-100">
                                                        <img src={team.image} alt="teamImg" className="h-20 w-20 sm:h-12 sm:w-12 object-cover rounded-full border-2 border-blue-100" />

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Full Name:</p>
                                                            <p>
                                                                {team.fullName}
                                                            </p>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Designation:</p>
                                                            <p>
                                                                {team.designation}
                                                            </p>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Update:</p>

                                                            <Link to={`/admin/team/update/${team._id}`} className="bg-green-600 px-4 py-3 rounded-md text-white max-w-max cursor-pointer flex gap-2 items-center"><UserPen /> <span>Update</span></Link>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Delete:</p>

                                                            <button onClick={() => handleDeleteTeam(team._id)} className="bg-red-600 px-5 py-2 rounded-md text-white max-w-max cursor-pointer flex gap-2 items-center"><Trash size={18} /><span>Delete</span></button>
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

export default AllTeam;