import { AdminSidebar, AdminContainer, TutorForm, LoadingSpinner } from "../../components";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";

function UpdateTutor() {
    const { id } = useParams();
    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTutor = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/tutors/single/${id}`);
                if (data.success) {
                    setTutor(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch tutor:', error);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchTutor();
        }
    }, [id]);

    if (loading) {
        return (
            <section className="flex min-h-[90vh]">
                <AdminSidebar />
                <AdminContainer>
                    <div className="flex justify-center items-center min-h-[400px]">
                        <LoadingSpinner />
                    </div>
                </AdminContainer>
            </section>
        );
    }

    return (
        <section className="flex min-h-[90vh]">
            <AdminSidebar />

            <AdminContainer>
                <section className="my-auto">
                    <div className="max-w-full">
                        <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">Update Tutor</h2>
                        <p className="text-gray-600">Update tutor information to keep your team profiles current and accurate.</p>
                    </div>

                    <TutorForm tutor={tutor} />
                </section>
            </AdminContainer>
        </section>
    );
}

export default UpdateTutor;