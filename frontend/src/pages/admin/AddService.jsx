import { AdminContainer, AddServiceForm, AdminSidebar } from "../../components";

function AddService(){    
    return (
        <section className="flex min-h-[90vh]">
            <AdminSidebar />

            <AdminContainer>
                <div className="max-w-full">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">Add a Service</h2>
                    <p className="text-gray-600">Define and publish a new service by adding details, pricing, and key benefits to promote your latest offering that align with your platform’s goals.</p>
                </div>

                <div className="my-10 max-w-full">
                    <AddServiceForm />
                </div>
            </AdminContainer>
        </section>
    );
}

export default AddService;