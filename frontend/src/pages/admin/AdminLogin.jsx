import { darkLogo } from "../../assets";
import { Container } from "../../components";
import AdminLogForm from "../../components/admin/AdminLogForm";

function AdminLogin(){
    return (
        <section className="pt-36 pb-20 bg-blue-100 relative">
            {/* <Container className="relative"> */}
                <div className="w-11/12 sm:w-5/7 md:w-3/7 p-5 xl:w-1/4 border-2 border-white sm:p-10 bg-white col-span-2 mx-auto">
                    <AdminLogForm />
                </div>
            {/* </Container> */}
        </section>
    );
}

export default AdminLogin;