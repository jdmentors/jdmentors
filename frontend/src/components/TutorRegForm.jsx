import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { EyeIcon, EyeOff, Lock, Mail, Phone, User, BookOpen, School, GraduationCap, FileText } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUser, toggleIsUserLoggedIn, toggleShowUserAuthForm } from "../features/forms/UserAuthSlice.js";

function TutorRegForm({ isLoginActive, setIsLoginActive }) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            password: '',
            image: '',
            classes: '',
            school: '',
            grades: '',
            description: '',
            userType: 'tutor'
        }
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [imagePreview, setImagePreview] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const registerFormHandler = async (formData) => {
        try {
            setIsRegistering(true);

            const submitData = new FormData();
            submitData.append('fullName', formData.fullName);
            submitData.append('email', formData.email);
            submitData.append('phone', formData.phone);
            submitData.append('password', formData.password);
            submitData.append('userType', 'tutor');
            submitData.append('classes', formData.classes);
            submitData.append('school', formData.school);
            submitData.append('grades', formData.grades);
            submitData.append('description', formData.description);

            if (formData.image[0]) {
                submitData.append('image', formData.image[0]);
            }

            const { data } = await axios.post(
                `${import.meta.env.VITE_DOMAIN_URL}/api/v1/tutors/register`,
                submitData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (data.success) {
                setIsRegistering(false);
                const accessToken = data.data.accessToken;
                dispatch(updateUser({ ...data.data.tutor, accessToken }));
                dispatch(toggleIsUserLoggedIn(true));
                dispatch(toggleShowUserAuthForm(false));
                toast.success(data.message);
                setIsRegistering(false);
                navigate('/tutor/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            setIsRegistering(false);
        }
    }

    return (
        <section className={`w-1/2 ${isLoginActive && 'translate-x-10'}`}>
            <form onSubmit={handleSubmit(registerFormHandler)} className="max-h-120 overflow-y-auto pr-2">
                <h3 className="text-2xl text-center my-5 text-blue-950">Register as Tutor</h3>

                {/* Personal Information */}
                <div className="text-gray-600 grid grid-cols-1 my-2">
                    <label className="flex items-center gap-1" htmlFor='fullName'>
                        <User size={18} /> <span>Full Name</span>
                    </label>
                    <input
                        id="fullName"
                        type="text"
                        placeholder="Full Name"
                        className="text-black border-2 border-blue-100 py-1 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200 w-full"
                        {...register('fullName', { required: true })}
                    />
                </div>

                <div className="text-gray-600 grid grid-cols-1 my-2">
                    <label className="flex items-center gap-1" htmlFor='tutorEmail'>
                        <Mail size={18} /> <span>Email</span>
                    </label>
                    <input
                        id="tutorEmail"
                        type="email"
                        placeholder="E-mail"
                        className="text-black border-2 border-blue-100 py-1 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200 w-full"
                        {...register('email', { required: true })}
                    />
                </div>

                <div className="text-gray-600 grid grid-cols-1 my-2">
                    <label className="flex items-center gap-1" htmlFor='tutorPhone'>
                        <Phone size={18} /> <span>Phone</span>
                    </label>
                    <input
                        id="tutorPhone"
                        type="tel"
                        placeholder="Phone No."
                        className="text-black border-2 border-blue-100 py-1 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200 w-full"
                        {...register('phone', { required: true })}
                    />
                </div>

                <div className="text-gray-600 grid grid-cols-1 my-2">
                    <label className="flex items-center gap-1" htmlFor='classes'>
                        <BookOpen size={18} /> <span>Classes You Tutor</span>
                    </label>
                    <input
                        id="classes"
                        type="text"
                        placeholder="e.g., LSAT"
                        className="text-black border-2 border-blue-100 py-2 px-3 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200 w-full"
                        {...register('classes', {
                            required: "Please specify the classes you tutor",
                            validate: {
                                notEmpty: value => value.trim().length > 0 || "Classes cannot be empty"
                            }
                        })}
                    />
                    {errors.classes && (
                        <p className="text-sm text-orange-500 font-light">{errors.classes.message}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Separate multiple classes with commas</p>
                </div>

                <div className="text-gray-600 grid grid-cols-1 my-2">
                    <label className="flex items-center gap-1" htmlFor='school'>
                        <School size={18} /> <span>School/University</span>
                    </label>
                    <input
                        id="school"
                        type="text"
                        placeholder="e.g., Harvard University"
                        className="text-black border-2 border-blue-100 py-1 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200 w-full"
                        {...register('school', { required: true })}
                    />
                </div>

                <div className="text-gray-600 grid grid-cols-1 my-2">
                    <label className="flex items-center gap-1" htmlFor='grades'>
                        <GraduationCap size={18} /> <span>Grades/Achievements</span>
                    </label>
                    <input
                        id="grades"
                        type="text"
                        placeholder="e.g., A+, A-"
                        className="text-black border-2 border-blue-100 py-1 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200 w-full"
                        {...register('grades', { required: true })}
                    />
                </div>

                <div className="text-gray-600 grid grid-cols-1 my-2">
                    <label className="flex items-center gap-1" htmlFor='description'>
                        <FileText size={18} /> <span>About You</span>
                    </label>
                    <textarea
                        id="description"
                        rows="3"
                        placeholder="Add a short intro about you..."
                        className="text-black border-2 border-blue-100 py-1 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200 w-full resize-vertical"
                        {...register('description', { required: true })}
                    />
                </div>

                <div className="text-gray-600 grid grid-cols-1 my-2">
                    <label className="flex items-center gap-1" htmlFor='tutorImage'>
                        <User size={18} /> <span>Profile Image</span>
                    </label>
                    <input
                        id="tutorImage"
                        type="file"
                        accept="image/*"
                        className="text-black border-2 border-blue-100 py-1 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200 w-full"
                        {...register('image')}
                        onChange={handleImageChange}
                    />
                </div>

                <div className="text-gray-600 grid grid-cols-1 my-2">
                    <label className="flex items-center gap-1" htmlFor='tutorPassword'>
                        <Lock size={18} /> <span>Password</span>
                    </label>
                    <div className="relative">
                        <input
                            id="tutorPassword"
                            type={`${showPassword ? 'text' : 'password'}`}
                            placeholder="Password"
                            className="text-black border-2 border-blue-100 py-1 px-2 focus-within:outline-2 focus-within:outline-blue-200 rounded my-1 w-full"
                            {...register('password', { required: true })}
                        />
                        <span onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
                            {showPassword ? <EyeIcon size={18} /> : <EyeOff size={18} />}
                        </span>
                    </div>
                </div>

                <button className="w-full bg-blue-600 py-2 text-white rounded cursor-pointer my-2 font-light" type="submit">
                    {
                        !isRegistering ? 'Register as Tutor' :
                            (<span className="flex space-x-1 items-center justify-center py-2">
                                <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                                <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.1s]"></span>
                                <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"></span>
                            </span>)
                    }
                </button>

                <p className="text-sm font-light text-gray-600">Already have an account? <span className="underline text-blue-500 cursor-pointer" onClick={() => setIsLoginActive(true)}>Login</span></p>
            </form>
        </section>
    );
}

export default TutorRegForm;