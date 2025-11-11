import axios from "axios";
import { LayoutDashboard, LogOut, UserCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router";
import { toggleIsUserLoggedIn, toggleShowUserAuthForm, updateUser } from "../../features/forms/UserAuthSlice.js";
import toast from "react-hot-toast";
import useRefreshToken from "../../hooks/useRefreshToken.jsx";
import useRefreshTokenTutor from "../../hooks/useRefreshTokenTutor.jsx";

const navigation = [
    { name: 'Dashboard', path: '/tutor/dashboard', icon: <LayoutDashboard size={25} strokeWidth={1.5} /> },
    { name: 'Profile', path: '/tutor/profile', icon: <UserCircle size={25} strokeWidth={1.5} /> },
];

function TutorSidebar() {
    const user = useSelector(state => state.user.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const refreshAccessToken = useRefreshTokenTutor();

    const logOutHandler = async () => {
        try {
            const { data } = await axios.get(
            `${import.meta.env.VITE_DOMAIN_URL}/api/v1/tutors/logout`, 
            { 
                withCredentials: true, // Important for cookies
                headers: { 
                    Authorization: `Bearer ${user.accessToken}` 
                } 
            }
        );

            if (data && data.success) {
                dispatch(toggleIsUserLoggedIn(false));
                dispatch(updateUser({}));
                navigate('/');
                toast.success(data.message);
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/tutors/logout`, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        dispatch(toggleIsUserLoggedIn(false));
                        dispatch(updateUser({}));
                        navigate('/');
                        toast.success(data.message);
                    }
                } catch (error) {
                    const message = error?.response?.data?.message;
                    toast.error(message);
                }
            } else {
                toast.error(message);
            }
        }
    }

    return (
        <aside className="border-r-2 border-r-blue-100 w-1/6">
            <nav>
                <ul>
                    {
                        navigation.map((link, i) => (
                            <li key={i}>
                                <NavLink to={link.path} className={({ isActive }) => `px-1 py-2 md:py-3 md:px-5 flex justify-center md:justify-start items-center gap-2 ${isActive && 'bg-blue-200 text-blue-500 border-r-3 border-r-blue-400'}`}>
                                    {link.icon}
                                    <span className="hidden md:block">{link.name}</span>
                                </NavLink>
                            </li>
                        ))
                    }
                    <li className="px-1 py-2 md:py-3 md:px-5 flex justify-center md:justify-start items-center cursor-pointer">
                        <button onClick={logOutHandler} className="flex gap-2 cursor-pointer"><LogOut size={25} strokeWidth={1.5} /> <span className="hidden md:block">Log Out</span></button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default TutorSidebar;