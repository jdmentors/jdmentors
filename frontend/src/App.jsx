import { Outlet } from "react-router";
import { Header, Footer, ScrollToTop, ScrollToTopIcon } from "./components";
import { Toaster } from "react-hot-toast";

function App(){
    return (
        <main>
            <ScrollToTop />
            <ScrollToTopIcon />
            <Toaster />
            <Header />
            <Outlet />
            <Footer />
        </main>
    );
}

export default App;