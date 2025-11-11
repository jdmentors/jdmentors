import { Outlet } from "react-router";
import { Footer, ScrollToTop, ScrollToTopIcon, TutorHeader } from "../../components";
import { Toaster } from "react-hot-toast";

function TutorLayout(){
    return (
        <>
            <ScrollToTop />
            <ScrollToTopIcon />
            <Toaster />
            <TutorHeader />
            <Outlet />
            <Footer />
        </>
    );
}

export default TutorLayout;