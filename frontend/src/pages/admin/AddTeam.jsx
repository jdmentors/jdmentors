import { AdminSidebar, AdminContainer, TeamForm } from "../../components";

function AddTeam() {
    return (
        <section className="flex min-h-[90vh]">
            <AdminSidebar />

            <AdminContainer>
                <section className="my-auto">

                    <div className="max-w-full">
                        <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">Add Team Member</h2>
                        <p className="text-gray-600">Strengthen your team by adding trusted members. These team members will be visible to users in the about us page.</p>
                    </div>

                    <TeamForm />
                </section>
            </AdminContainer>
        </section>
    );
}

export default AddTeam;