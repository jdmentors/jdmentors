import { Outlet } from "react-router";
import { Footer, ScrollToTop, ScrollToTopIcon, UserHeader } from "../../components";
import { Toaster } from "react-hot-toast";

function UserLayout(){
    return (
        <>
            <ScrollToTop />
            <ScrollToTopIcon />
            <Toaster />
            <UserHeader />
            <Outlet />
            <Footer />
        </>
    );
}

export default UserLayout;