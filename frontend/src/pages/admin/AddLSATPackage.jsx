import { AdminContainer, AddLSATPackageForm, AdminSidebar } from "../../components";

function AddLSATPackage(){    
    return (
        <section className="flex min-h-[90vh]">
            <AdminSidebar />

            <AdminContainer>
                <div className="max-w-full">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">Add LSAT Tutoring Package</h2>
                    <p className="text-gray-600">Create LSAT tutoring packages with specific session counts, pricing, and features to offer students flexible learning options.</p>
                </div>

                <div className="my-10 max-w-full">
                    <AddLSATPackageForm />
                </div>
            </AdminContainer>
        </section>
    );
}

export default AddLSATPackage;