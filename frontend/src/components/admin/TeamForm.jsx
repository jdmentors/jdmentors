import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateUser } from "../../features/forms/UserAuthSlice.js";
import toast from "react-hot-toast";
import { useState } from "react";
import { user as userImg } from "../../assets/index.js";
import { Camera } from "lucide-react";
import useRefreshToken from "../../hooks/useRefreshToken.jsx";
import { useNavigate } from "react-router";

function TeamForm({member}) {
    const user = useSelector(state => state.user.user);
    const refreshAccessToken = useRefreshToken();
    const [isAdding, setIsAdding] = useState(false);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, getValues, setValue, watch } = useForm({
        defaultValues: {
            fullName: member?.fullName || '',
            designation: member?.designation || '',
            image: member?.image || ''
        }
    });

    const dispatch = useDispatch();

    const handleAddTeam = async (memberData) => {
        try {
            setIsAdding(true);
            const formData = new FormData();
            formData.append('fullName', memberData.fullName);
            formData.append('designation', memberData.designation);

            if (memberData.image[0] instanceof File) {
                formData.append('image', memberData.image[0]);
            } else {
                formData.append('image', memberData.image);
            }

            const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/team/add`, formData, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data) {
                toast.success(data.message);
                setIsAdding(false);
                navigate('/admin/team/all');
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const formData = new FormData();
                    formData.append('fullName', memberData.fullName);
                    formData.append('designation', memberData.designation);

                    if (memberData.image[0] instanceof File) {
                        formData.append('image', memberData.image[0]);
                    }

                    const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/team/add`, formData, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        toast.success(data.message);
                        const refreshToken = data.data.refreshToken;
                        dispatch(updateUser({ ...user, accessToken: newAccessToken, refreshToken }));
                        setIsAdding(false);
                        navigate('/admin/team/all');
                    }
                } catch (error) {
                    console.error(error);
                    toast.error(error?.response?.data?.message);
                    setIsAdding(false);
                }
            } else {
                setIsAdding(false);
                toast.error(message);
            }
        }
    }

    const handleUpdateTeam = async (memberData) => {
        try {
            setIsAdding(true);
            const formData = new FormData();
            formData.append('fullName', memberData.fullName);
            formData.append('designation', memberData.designation);

            if (memberData.image[0] instanceof File) {
                formData.append('image', memberData.image[0]);
            } else {
                formData.append('image', memberData.image);
            }

            const { data } = await axios.patch(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/team/update/${member._id}`, formData, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data) {
                toast.success(data.message);
                setIsAdding(false);
                navigate('/admin/team/all');
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const formData = new FormData();
                    formData.append('fullName', memberData.fullName);
                    formData.append('designation', memberData.designation);

                    if (memberData.image[0] instanceof File) {
                        formData.append('image', memberData.image[0]);
                    }

                    const { data } = await axios.patch(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/team/update/${member._id}`, formData, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        toast.success(data.message);
                        const refreshToken = data.data.refreshToken;
                        dispatch(updateUser({ ...user, accessToken: newAccessToken, refreshToken }));
                        setIsAdding(false);
                        navigate('/admin/team/all');
                    }
                } catch (error) {
                    console.error(error);
                    toast.error(error?.response?.data?.message);
                    setIsAdding(false);
                }
            } else {
                setIsAdding(false);
                toast.error(message);
            }
        }
    }

    const image = watch('image');
    return (
        <div className="flex gap-4 mt-20">
            <div
                className="w-full lg:w-4/5 xl:w-2xl shadow-[5px_5px_20px_rgba(219,234,254,1),-5px_-5px_20px_rgba(219,234,254,1)] p-10 rounded-xl h-fit relative ">
                <div>
                    <form onSubmit={member ? handleSubmit(handleUpdateTeam) : handleSubmit(handleAddTeam)} encType="multipart/form-data">
                        {/* <!-- Profile Image --> */}
                        <div className="absolute top-0 left-1/2 -translate-1/2 rounded-full overflow-hidden h-24 w-24 border-2 border-blue-200">
                            <label className="w-full h-full relative group">
                                <input type="file" {...register('image')} hidden />

                                {/* <img src={image?.[0] instanceof File ? URL.createObjectURL(image[0]) : user.image ? user.image : userImg} loading="lazy" alt="user image" className="w-full h-full object-cover cursor-pointer peer" /> */}
                                <img src={image?.[0] instanceof File ? URL.createObjectURL(image[0]) : member?.image ? member.image : userImg} loading="lazy" alt="team image" className="w-full h-full object-cover cursor-pointer peer" />

                                <div className="absolute top-1/2 left-1/2 -translate-1/2 h-full w-full bg-gray-800/40 group-hover:flex items-center justify-center hidden cursor-pointer">
                                    <div>
                                        <Camera className="text-white" />
                                    </div>
                                </div>
                            </label>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-2 mt-10">
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-700" htmlFor="fullName">Full Name:</label>
                                <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="fullName" type="text" {...register('fullName', { required: true })} placeholder="Enter fullName here..." />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-gray-700" htmlFor="designation">Designation:</label>
                                <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="designation" type="text" {...register('designation', { required: true })} placeholder="Enter designation here..." />
                            </div>
                        </div>
                        <div className="w-full rounded bg-blue-600 mt-4 text-white text">

                            <button className="w-full p-2 cursor-pointer flex gap-1 items-center justify-center" type="submit">
                                {
                                    !isAdding ? 'Add Member' :
                                        (<span className="flex space-x-1 items-center justify-center py-2">
                                            <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                                            <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.1s]"></span>
                                            <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"></span>
                                        </span>)
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TeamForm;