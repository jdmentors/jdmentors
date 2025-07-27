import { Outlet } from "react-router";
import { Header, Footer, ScrollToTop, ScrollToTopIcon, UserAuth } from "./components";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

function App(){
    const showUserForm = useSelector(state => state.user.showUserAuthForm);
    return (
        <main>
            <ScrollToTop />
            <ScrollToTopIcon />
            {showUserForm && <UserAuth />}
            <Toaster />
            <Header />
            <Outlet />
            <Footer />
        </main>
    );
}

export default App;