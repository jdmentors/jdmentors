import { BaggageClaim, LayoutDashboard, LogOut } from "lucide-react";
import { NavLink } from "react-router";

const navigation = [
    {name:'Dashboard', path:'/user/dashboard', icon: <LayoutDashboard size={25} strokeWidth={1.5} />},
];

function UserSidebar(){
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
                    <li className="px-1 py-2 md:py-3 md:px-5 flex justify-center md:justify-start items-center cursor-pointer" onClick={() => ``}>
                        <button className="flex gap-2 cursor-pointer"><LogOut size={25} strokeWidth={1.5} /> <span className="hidden md:block">Log Out</span></button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default UserSidebar;