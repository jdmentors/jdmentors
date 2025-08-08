import { useParams } from "react-router";
import { AdminContainer, AddServiceForm, AdminSidebar } from "../../components";
import { useEffect, useState } from "react";
import axios from "axios";

function EditService() {
    const { serviceId } = useParams();
    const [service, setService] = useState(null);

    useEffect(() => {
        const getAService = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/services/single/${serviceId}`);

                if (data && data.success) {
                    setService(data.data);
                }
            } catch (error) {
                console.error(error);
            }
        }

        getAService();
    }, [serviceId])

    return (
        <section className="flex min-h-[90vh]">
            <AdminSidebar />

            <AdminContainer>
                <div className="max-w-full">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">Edit a Service</h2>
                    <p className="text-gray-600">Edit a service by updating details, pricing, and key benefits to promote your latest offering that align with your platform’s goals.</p>
                </div>

                <div className="my-10 max-w-full">
                    {
                        service&&
                        <AddServiceForm service={service} />
                    }
                </div>
            </AdminContainer>
        </section>
    );
}

export default EditService;