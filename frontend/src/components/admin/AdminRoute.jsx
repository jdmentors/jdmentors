import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

function AdminRoute({ children }) {
    const userType = useSelector(state => state.user.user.userType);
    const isLoggedIn = useSelector(state => state.user.isUserLoggedIn);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            return navigate('/');
        }

        if (userType !== "admin") {
            return navigate('/');
        }
    }, [])

    return children;
}

export default AdminRoute;