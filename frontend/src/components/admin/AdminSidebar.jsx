import axios from "axios";
import { LaptopIcon, LayoutDashboard, LogOut, Newspaper, Plus, Settings, Tags, UserCircle, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router";
import { toggleIsUserLoggedIn, updateUser } from "../../features/forms/UserAuthSlice.js";
import toast from "react-hot-toast";
import useRefreshToken from "../../hooks/useRefreshToken";

const navigation = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={25} strokeWidth={1.5} /> },
    { name: 'Sessions', path: '/admin/sessions', icon: <LaptopIcon size={25} strokeWidth={1.5} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={25} strokeWidth={1.5} /> },
    { name: 'Services', path: '/admin/services', icon: <Settings size={25} strokeWidth={1.5} /> },
    { name: 'Blogs', path: '/admin/blogs', icon: <Newspaper size={25} strokeWidth={1.5} /> },
    { name: 'Coupons', path: '/admin/coupons', icon: <Tags size={25} strokeWidth={1.5} /> },
    { name: 'Profile', path: '/admin/profile', icon: <UserCircle size={25} strokeWidth={1.5} /> },
    { name: 'Create Admin', path: '/admin/create', icon: <Plus size={25} strokeWidth={1.5} /> },
];

function AdminSidebar() {
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const refreshAccessToken = useRefreshToken();

    const logOutHandler = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/users/logout`, { headers: { Authorization: `Bearer ${user.accessToken}` } });

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

                    const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/users/logout`, { headers: { Authorization: `Bearer ${newAccessToken}` } });

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
        <aside className="border-r-2 bg-gray-900 text-white border-r-blue-100 w-1/6">
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
                    <li className="px-1 py-2 md:py-3 md:px-5 flex justify-center md:justify-start items-center cursor-pointer" onClick={() => logOutHandler()}>
                        <button className="flex gap-2 cursor-pointer"><LogOut size={25} strokeWidth={1.5} /> <span className="hidden md:block">Log Out</span></button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default AdminSidebar;