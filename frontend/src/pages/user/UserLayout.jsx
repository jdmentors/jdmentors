import { Outlet } from "react-router";
import { Footer, Header, UserHeader } from "../../components";

function UserLayout(){
    return (
        <>
            <UserHeader />
            <Outlet />
            <Footer />
        </>
    );
}

export default UserLayout;