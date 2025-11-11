import { AdminSidebar, AdminContainer, TutorForm } from "../../components";

function AddTutor() {
    return (
        <section className="flex min-h-[90vh]">
            <AdminSidebar />

            <AdminContainer>
                <section className="my-auto">
                    <div className="max-w-full">
                        <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">Add Tutor</h2>
                        <p className="text-gray-600">Strengthen your tutoring team by adding qualified tutors. These tutors will be visible to users on the tutors page.</p>
                    </div>

                    <TutorForm />
                </section>
            </AdminContainer>
        </section>
    );
}

export default AddTutor;