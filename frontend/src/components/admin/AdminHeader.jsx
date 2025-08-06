import { Link, useNavigate } from "react-router";
import { darkLogo, omar } from "../../assets";
import { useSelector } from "react-redux";
import { user as userImg } from "../../assets";

function AdminHeader(){
    const navigate = useNavigate();
    const user = useSelector(state => state.user.user);
    return (
        <header className="flex w-full p-4 md:px-10 justify-between border-b border-b-blue-100">
            <Link to="/" className="z-50">
                <img src={darkLogo} alt="logo" className="h-8 md:h-10 z-50" />
            </Link>

            <div className="z-50 flex items-center gap-5">
                <img src={user.image ? user.image : userImg} alt="adminImg" className="h-9 w-9 sm:h-12 sm:w-12 object-cover rounded-full border-2 border-blue-100 cursor-pointer" onClick={() => navigate('/admin/profile')} />
            </div>
        </header>
    );
}

export default AdminHeader;