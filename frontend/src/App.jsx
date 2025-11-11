import { Outlet } from "react-router";
import { Header, Footer, ScrollToTop, ScrollToTopIcon, UserAuth, TutorAuth } from "./components";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

function App(){
    const showUserForm = useSelector(state => state.user.showUserAuthForm);
    const authType = useSelector(state => state.user.authType);
    
    return (
        <main>
            <ScrollToTop />
            <ScrollToTopIcon />
            {showUserForm && (
                <>
                    {authType === 'user' && <UserAuth />}
                    {authType === 'tutor' && <TutorAuth />}
                    {/* Or use CombinedAuth instead of separate components */}
                </>
            )}
            <Toaster />
            <Header />
            <Outlet />
            <Footer />
        </main>
    );
}

export default App;