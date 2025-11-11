import { AdminContainer, AdminSidebar, LoadingSpinner } from "../../components";
import { Plus, Trash, UserPen } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import useGetAllTutor from "../../hooks/useGetAllTutor.jsx";
import { useDispatch, useSelector } from "react-redux";
import useRefreshToken from "../../hooks/useRefreshToken";
import { useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { updateUser } from "../../features/forms/UserAuthSlice.js";
import { user } from "../../assets/index.js";

function AllTutors() {
    const [allTutors, setAllTutors] = useState(null);
    const getAllTutors = useGetAllTutor();
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();
    const refreshAccessToken = useRefreshToken();

    useEffect(() => {
        const fetchAllTutors = async () => {
            setAllTutors(await getAllTutors());
        }
        fetchAllTutors();
    }, [])

    const handleDeleteTutor = async (id) => {
        try {
            const { data } = await axios.delete(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/tutors/delete/${id}`, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data && data.success) {
                toast.success(data.message);
                setAllTutors(prevTutors => prevTutors.filter(tutor => tutor._id.toString() !== id.toString()));
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.delete(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/tutor/delete/${id}`, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        toast.success(data.message);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                        setAllTutors(prevTutors => prevTutors.filter(tutor => tutor._id.toString() !== id.toString()));
                    }
                } catch (error) {
                    console.error(error);
                    toast.error(error?.response?.data?.message || 'Failed to delete tutor');
                }
            } else {
                toast.error(message || 'Failed to delete tutor');
            }
        }
    }

    return (
        <section className="flex min-h-[90vh]">
            <AdminSidebar />

            <AdminContainer>
                <div className="max-w-full relative">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">All Tutors</h2>
                    <p className="text-gray-600">All your tutoring team members, one clean view. Efficiently manage tutor profiles and stay informed on every team member.</p>

                    <br />

                    <Link className="bg-blue-600 py-3 px-6 rounded-md text-white cursor-pointer sm:absolute sm:right-0 sm:top-0 flex items-center gap-1 justify-start max-w-max" to="/admin/tutors/add">
                        <Plus size={18} strokeWidth={3} />
                        <span>Add Tutor</span>
                    </Link>
                </div>

                <div className="my-10 max-w-full">
                    <div className="overflow-hidden rounded-2xl border-2 border-blue-100 bg-white px-4 pb-3 pt-4 sm:px-6">
                        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">All Tutors</h3>
                        </div>

                        <div className="my-5 overflow-x-auto">
                            <div className="hidden sm:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-5 items-center py-3 border-b-2 border-b-blue-100">
                                <h5 className="text-lg">Image</h5>
                                <h5 className="text-lg">Full Name</h5>
                                <h5 className="text-lg">School</h5>
                                <h5 className="text-lg">Classes</h5>
                                <h5 className="text-lg">Grades</h5>
                                <h5 className="text-lg">Description</h5>
                                <h5 className="text-lg">Actions</h5>
                            </div>

                            {
                                allTutors
                                    ?
                                    (
                                        <>
                                            <div className="hidden sm:block">
                                                {
                                                    allTutors.map(tutor => (
                                                        <div key={tutor._id} className="md:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-5 items-center py-5 text-gray-600 border-b border-blue-50">
                                                            <img
                                                                src={tutor.image ? tutor.image : user}
                                                                alt="tutorImg"
                                                                className="h-9 w-9 sm:h-14 sm:w-14 object-cover rounded-full border-2 border-blue-100"
                                                            />

                                                            <p className="font-medium text-blue-950">{tutor.fullName}</p>

                                                            <p>{tutor.school}</p>

                                                            <div>
                                                                {tutor.classes.slice(0, 2).map((cls, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1"
                                                                    >
                                                                        {cls}
                                                                    </span>
                                                                ))}
                                                                {tutor.classes.length > 2 && (
                                                                    <span className="text-xs text-gray-500">
                                                                        +{tutor.classes.length - 2} more
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <p className="font-semibold text-green-600">{tutor.grades}</p>

                                                            <p className="text-sm line-clamp-2">{tutor.description || 'Not Provided'}</p>

                                                            <div className="flex gap-2">
                                                                <Link
                                                                    to={`/admin/tutors/update/${tutor._id}`}
                                                                    className="bg-green-600 px-4 py-2 rounded-md text-white max-w-max cursor-pointer flex gap-2 items-center hover:bg-green-700 transition-colors"
                                                                >
                                                                    <UserPen size={24} />
                                                                </Link>

                                                                <button
                                                                    onClick={() => handleDeleteTutor(tutor._id)}
                                                                    className="bg-red-600 px-4 py-2 rounded-md text-white max-w-max cursor-pointer flex gap-2 items-center hover:bg-red-700 transition-colors"
                                                                >
                                                                    <Trash size={24} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <div className="sm:hidden">
                                                {
                                                    allTutors.map(tutor => (
                                                        <div key={tutor._id} className="flex flex-col gap-4 py-6 text-gray-600 border-b-2 border-b-blue-100">
                                                            <div className="flex items-center gap-4">
                                                                <img
                                                                    src={tutor.image ? tutor.image : user}
                                                                    alt="tutorImg"
                                                                    className="h-16 w-16 object-cover rounded-full border-2 border-blue-100"
                                                                />
                                                                <div>
                                                                    <p className="font-semibold text-lg text-blue-950">{tutor.fullName}</p>
                                                                    <p className="text-green-600 font-medium">{tutor.grades}</p>
                                                                </div>
                                                            </div>

                                                            <div className="flex gap-4">
                                                                <p className="text-gray-800 font-medium min-w-16">School:</p>
                                                                <p>{tutor.school}</p>
                                                            </div>

                                                            <div className="flex gap-4">
                                                                <p className="text-gray-800 font-medium min-w-16">Classes:</p>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {tutor.classes.map((cls, index) => (
                                                                        <span
                                                                            key={index}
                                                                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                                                        >
                                                                            {cls}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="flex gap-4">
                                                                <p className="text-gray-800 font-medium min-w-20">Description:</p>
                                                                <p className="text-sm">{tutor.description || 'Not Provided'}</p>
                                                            </div>

                                                            <div className="flex gap-4 pt-2">
                                                                <Link
                                                                    to={`/admin/tutors/update/${tutor._id}`}
                                                                    className="bg-green-600 px-4 py-2 rounded-md text-white max-w-max cursor-pointer flex gap-2 items-center flex-1 justify-center"
                                                                >
                                                                    <UserPen size={16} />
                                                                </Link>

                                                                <button
                                                                    onClick={() => handleDeleteTutor(tutor._id)}
                                                                    className="bg-red-600 px-4 py-2 rounded-md text-white max-w-max cursor-pointer flex gap-2 items-center flex-1 justify-center"
                                                                >
                                                                    <Trash size={16} />
                                                                </button>
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

export default AllTutors;