import { Outlet } from "react-router";
import { Footer, ScrollToTop, ScrollToTopIcon, AdminHeader, AdminFooter } from "../../components";
import { Toaster } from "react-hot-toast";

function AdminLayout(){
    return (
        <>
            <ScrollToTop />
            <ScrollToTopIcon />
            <Toaster />
            <AdminHeader />
            <Outlet />
            <AdminFooter />
        </>
    );
}

export default AdminLayout;