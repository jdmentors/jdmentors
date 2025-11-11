import { TutorSidebar, TutorContainer } from "../../components";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateUser } from "../../features/forms/UserAuthSlice.js";
import toast from "react-hot-toast";
import { useState } from "react";
import { user as userImg } from "../../assets";
import { Camera, BookOpen, School, GraduationCap, FileText } from "lucide-react";
import useRefreshTokenTutor from "../../hooks/useRefreshTokenTutor";

function TutorProfile() {
    const user = useSelector(state => state.user.user);
    const refreshAccessToken = useRefreshTokenTutor();
    const [isUpdating, setIsUpdating] = useState(false);

    const { register, handleSubmit, watch, formState: { errors }, getValues } = useForm({
        defaultValues: {
            fullName: user.fullName || '',
            email: user.email || '',
            phone: user.phone || '',
            password: '',
            image: user.image || '',
            classes: user.classes ? user.classes.join(', ') : '',
            school: user.school || '',
            grades: user.grades || '',
            description: user.description || ''
        }
    });

    const dispatch = useDispatch();

    const handleUpdateProfile = async (profileData) => {
        try {
            setIsUpdating(true);
            const formData = new FormData();
            formData.append('fullName', profileData.fullName);
            formData.append('email', profileData.email);
            formData.append('phone', profileData.phone);
            formData.append('password', profileData.password);
            formData.append('classes', profileData.classes);
            formData.append('school', profileData.school);
            formData.append('grades', profileData.grades);
            formData.append('description', profileData.description);

            if (profileData.image[0] instanceof File) {
                formData.append('image', profileData.image[0]);
            } else {
                formData.append('image', profileData.image);
            }

            const { data } = await axios.patch(
                `${import.meta.env.VITE_DOMAIN_URL}/api/v1/tutors/update`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${user.accessToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (data) {
                const accessToken = data.data.accessToken;
                const refreshToken = data.data.refreshToken;
                dispatch(updateUser({ ...data.data.tutor, accessToken, refreshToken }));
                toast.success(data.message);
                setIsUpdating(false);
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const formData = new FormData();
                    formData.append('fullName', profileData.fullName);
                    formData.append('email', profileData.email);
                    formData.append('phone', profileData.phone);
                    formData.append('password', profileData.password);
                    formData.append('classes', profileData.classes);
                    formData.append('school', profileData.school);
                    formData.append('grades', profileData.grades);
                    formData.append('description', profileData.description);

                    if (profileData.image[0] instanceof File) {
                        formData.append('image', profileData.image[0]);
                    }

                    const { data } = await axios.patch(
                        `${import.meta.env.VITE_DOMAIN_URL}/api/v1/tutors/update`,
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${newAccessToken}`,
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    );

                    if (data && data.success) {
                        toast.success(data.message);
                        const refreshToken = data.data.refreshToken;
                        dispatch(updateUser({ ...data.data.tutor, accessToken: newAccessToken, refreshToken }));
                        setIsUpdating(false);
                    }
                } catch (error) {
                    console.error(error);
                    toast.error(error?.response?.data?.message);
                    setIsUpdating(false);
                }
            } else {
                setIsUpdating(false);
                toast.error(message);
            }
        }
    }

    const image = watch('image');

    return (
        <section className="flex min-h-[90vh]">
            <TutorSidebar />

            <TutorContainer>
                {
                    user
                        ?
                        <section className="my-auto">

                            <div className="max-w-full">
                                <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">Tutor Profile</h2>
                                <p className="text-gray-600">Keep your tutor profile accurate and up to date to attract more students. Showcase your expertise and qualifications.</p>
                            </div>

                            <div className="flex gap-4 mt-20">
                                <div className="w-full lg:w-4/5 xl:w-2xl shadow-[5px_5px_20px_rgba(219,234,254,1),-5px_-5px_20px_rgba(219,234,254,1)] p-10 rounded-xl h-fit relative">
                                    <div>
                                        <form onSubmit={handleSubmit(handleUpdateProfile)} encType="multipart/form-data">
                                            {/* <!-- Profile Image --> */}
                                            <div className="absolute top-0 left-1/2 -translate-1/2 rounded-full overflow-hidden h-24 w-24 border-2 border-blue-200">
                                                <label className="w-full h-full relative group">
                                                    <input type="file" {...register('image')} hidden />

                                                    <img src={image?.[0] instanceof File ? URL.createObjectURL(image[0]) : user.image ? user.image : userImg} loading="lazy" alt="tutor image" className="w-full h-full object-cover cursor-pointer peer" />

                                                    <div className="absolute top-1/2 left-1/2 -translate-1/2 h-full w-full bg-gray-800/40 group-hover:flex items-center justify-center hidden cursor-pointer">
                                                        <div>
                                                            <Camera className="text-white" />
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-4 mt-16">
                                                {/* Personal Information */}
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-gray-700 flex items-center gap-1" htmlFor="fullName">
                                                        <span>Full Name</span>
                                                    </label>
                                                    <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="fullName" type="text" {...register('fullName', { required: true })} placeholder="Enter full name here..." />
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <label className="text-gray-700 flex items-center gap-1" htmlFor="email">
                                                        <span>Email</span>
                                                    </label>
                                                    <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="email" type="email" {...register('email', { required: true })} placeholder="Enter email here..." />
                                                </div>

                                                <div className="text-gray-600 grid grid-cols-1">
                                                    <label className="text-gray-700" htmlFor='phone'>
                                                        Phone
                                                    </label>
                                                    <input
                                                        id="phone"
                                                        type="tel"
                                                        placeholder="(+1) 917-XXX-XXXX"
                                                        className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200"
                                                        onInput={(e) => {
                                                            e.target.value = e.target.value.replace(/[^0-9+\s()\-]/g, '');
                                                        }}
                                                        {...register('phone', {
                                                            required: true,
                                                            pattern: {
                                                                value: /^[0-9+\s()\-]+$/,
                                                                message: "Please enter a valid phone number (numbers, +, -, () only)"
                                                            }
                                                        })}
                                                    />
                                                    {errors.phone?.type === 'required' && (
                                                        <p className="text-sm text-orange-500 font-light">Phone is required</p>
                                                    )}
                                                    {errors.phone?.type === 'pattern' && (
                                                        <p className="text-sm text-orange-500 font-light">{errors.phone.message}</p>
                                                    )}
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <label className="text-gray-700" htmlFor="password">Password:</label>
                                                    <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="password" type="password" {...register('password', { required: true })} placeholder="Enter password here..." />
                                                </div>

                                                {/* Academic Information */}
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-gray-700 flex items-center gap-1" htmlFor="classes">
                                                        <BookOpen size={16} />
                                                        <span>Classes You Tutor</span>
                                                    </label>
                                                    <input
                                                        className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full"
                                                        id="classes"
                                                        type="text"
                                                        {...register('classes', { required: true })}
                                                        placeholder="e.g., LSAT"
                                                    />
                                                    <p className="text-xs text-gray-500">Separate multiple classes with commas</p>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <label className="text-gray-700 flex items-center gap-1" htmlFor="school">
                                                        <School size={16} />
                                                        <span>School/University</span>
                                                    </label>
                                                    <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="school" type="text" {...register('school', { required: true })} placeholder="e.g., Harvard University" />
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <label className="text-gray-700 flex items-center gap-1" htmlFor="grades">
                                                        <GraduationCap size={16} />
                                                        <span>Grades/Achievements</span>
                                                    </label>
                                                    <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="grades" type="text" {...register('grades', { required: true })} placeholder="e.g., GPA 3.8, SAT 1500" />
                                                </div>
                                            </div>

                                            {/* Description - Full Width */}
                                            <div className="mt-4">
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-gray-700 flex items-center gap-1" htmlFor="description">
                                                        <FileText size={16} />
                                                        <span>About You</span>
                                                    </label>
                                                    <textarea
                                                        className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full resize-vertical"
                                                        id="description"
                                                        rows="4"
                                                        {...register('description', { required: true })}
                                                        placeholder="Tell us about your teaching experience, methodology, and why you'd be a great tutor..."
                                                    />
                                                </div>
                                            </div>

                                            <div className="w-full rounded bg-blue-600 mt-6 text-white">
                                                <button className="w-full p-2 cursor-pointer flex gap-1 items-center justify-center" type="submit">
                                                    {
                                                        !isUpdating ? 'Update Tutor Profile' :
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
                        </section>
                        :
                        ''
                }
            </TutorContainer>
        </section>
    );
}

export default TutorProfile;