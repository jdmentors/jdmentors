import { useParams } from "react-router";
import { AdminContainer, AddExtraForm, AdminSidebar } from "../../components";
import { useEffect, useState } from "react";
import axios from "axios";

function EditExtra() {
    const { extraId } = useParams();
    const [extra, setExtra] = useState(null);

    useEffect(() => {
        const getAnExtra = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/extras/single/${extraId}`);

                if (data && data.success) {
                    setExtra(data.data);
                }
            } catch (error) {
                console.error(error);
            }
        }

        getAnExtra();
    }, [extraId])

    return (
        <section className="flex min-h-[90vh]">
            <AdminSidebar />

            <AdminContainer>
                <div className="max-w-full">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">Edit an Extra</h2>
                    <p className="text-gray-600">Edit an extra by updating details, pricing, and key benefits to promote your latest offering that align with your platform’s goals.</p>
                </div>

                <div className="my-10 max-w-full">
                    {
                        extra &&
                        <AddExtraForm extra={extra} />
                    }
                </div>
            </AdminContainer>
        </section>
    );
}

export default EditExtra;