import { AdminSidebar, AdminContainer } from "../components";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toggleIsUserLoggedIn, toggleShowUserAuthForm, updateUser } from "../features/forms/UserAuthSlice.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useState } from "react";
import { user as userImg } from "../assets/index.js";
import { Camera, UserPen } from "lucide-react";

function Profile() {
    const user = useSelector(state => state.user.user);

    const { register, handleSubmit, watch } = useForm({
        defaultValues: {
            fullName: user.fullName || '',
            email: user.email || '',
            phone: user.phone || '',
            password: '',
            image: user.image || ''
        }
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleUpdateProfile = async (profileData) => {
        try {
            console.log(profileData);
            // const formData = new FormData();
            // formData.append('fullName', profileData.fullName);
            // formData.append('email', profileData.email);
            // formData.append('phone', profileData.phone);
            // formData.append('password', profileData.password);

            // if(profileData.image[0] instanceof File){
            //     formData.append('image', profileData.image[0]);
            // }

            // const { data } = await axios.put('/api/v1/users/update', formData, {headers:{Authorization: `Bearer ${user.accessToken}`, 'Content-Type':'multipart/form-data'}});

            // if(data){
            //     console.log(data.data);
            //     const accessToken = data.data.accessToken;
            //     dispatch(toggleIsUserLoggedIn(true));
            //     dispatch(updateUser({...data.data.user, accessToken}));
            //     toast.success(data.message);
            // }
        } catch (error) {
            console.error(error.message);
            toast.error(error.response.data.message);
        }
    }

    const image = watch('image');

    return (
        <section className="flex min-h-[90vh]">
            <AdminSidebar />

            <AdminContainer>
                {
                    user
                        ?
                        <section className="my-auto">

                            <div className="max-w-full">
                                <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">Update Profile</h2>
                                <p className="text-gray-600">Keep your profile accurate and up to date to ensure account security. Stay organized by keeping your admin profile clean and updated.</p>
                            </div>
                            
                            <div className="flex gap-4 mt-20">
                                <div
                                    className="w-full lg:w-4/5 xl:w-2xl shadow-[5px_5px_20px_rgba(219,234,254,1),-5px_-5px_20px_rgba(219,234,254,1)] p-10 rounded-xl h-fit relative ">
                                    <div>
                                        <form onSubmit={handleSubmit(handleUpdateProfile)} encType="multipart/form-data">
                                            {/* <!-- Profile Image --> */}
                                            <div className="absolute top-0 left-1/2 -translate-1/2 rounded-full overflow-hidden h-24 w-24 border-2 border-blue-200">
                                                <label className="w-full h-full relative group">
                                                    <input type="file" {...register('image')} hidden />

                                                    <img src={image?.[0] instanceof File ? URL.createObjectURL(image[0]) : userImg} alt="user image" className="w-full h-full object-cover cursor-pointer peer" />

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
                                                    <label className="text-gray-700" htmlFor="email">Email:</label>
                                                    <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="email" type="email" {...register('email', { required: true })} placeholder="Enter email here..." />
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <label className="text-gray-700" htmlFor="phone">Phone:</label>
                                                    <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="phone" type="tel" {...register('phone', {required:true})} placeholder="Enter blog phone here..." />
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <label className="text-gray-700" htmlFor="password">Password:</label>
                                                    <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="password" type="password" {...register('password', {required:true})} placeholder="Enter blog password here..." />
                                                </div>
                                            </div>
                                            <div className="w-full rounded bg-blue-600 mt-4 text-white text">
                                                <button type="submit" className="w-full p-2 cursor-pointer flex gap-1 items-center justify-center">
                                                    <UserPen />
                                                    <span className="mx-2">Update Profile</span>
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </section>
                        :
                        ''
                }
            </AdminContainer>
        </section>
    );
}

export default Profile;