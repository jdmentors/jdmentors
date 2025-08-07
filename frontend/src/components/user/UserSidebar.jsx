import axios from "axios";
import { LayoutDashboard, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router";
import { toggleIsUserLoggedIn, toggleShowUserAuthForm, updateUser } from "../../features/forms/UserAuthSlice.js";
import toast from "react-hot-toast";
import useRefreshToken from "../../hooks/useRefreshToken.jsx";

const navigation = [
    {name:'Dashboard', path:'/user/dashboard', icon: <LayoutDashboard size={25} strokeWidth={1.5} />},
];

function UserSidebar(){
    const user = useSelector(state => state.user.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const refreshAccessToken = useRefreshToken();

    const logOutHandler = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/users/logout`, {headers: {Authorization: `Bearer ${user.accessToken}`}});

            if(data && data.success){
                dispatch(toggleIsUserLoggedIn(false));
                dispatch(updateUser({}));
                navigate('/');
                toast.success(data.message);
            }
        } catch (error) {
            if(error?.response?.data?.message === 'accessToken'){
                const newAccessToken = await refreshAccessToken();

                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/users/logout`, {headers: {Authorization: `Bearer ${newAccessToken}`}});

                if(data && data.success){
                    dispatch(toggleIsUserLoggedIn(false));
                    dispatch(updateUser({}));
                    navigate('/');
                    toast.success(data.message);
                }
            }else{
                throw new Error(error);
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
                                <NavLink to={link.path} className={({isActive}) => `px-1 py-2 md:py-3 md:px-5 flex justify-center md:justify-start items-center gap-2 ${isActive && 'bg-blue-200 text-blue-500 border-r-3 border-r-blue-400'}`}>
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

export default UserSidebar;