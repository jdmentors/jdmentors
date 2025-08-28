import { useParams } from "react-router";
import { AdminContainer, AddAddonForm, AdminSidebar } from "../../components";
import { useEffect, useState } from "react";
import axios from "axios";

function EditAddon() {
    const { addonId } = useParams();
    const [addon, setAddon] = useState(null);

    useEffect(() => {
        const getAnAddon = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/addons/single/${addonId}`);

                if (data && data.success) {
                    setAddon(data.data);
                }
            } catch (error) {
                console.error(error);
            }
        }

        getAnAddon();
    }, [addonId])

    return (
        <section className="flex min-h-[90vh]">
            <AdminSidebar />

            <AdminContainer>
                <div className="max-w-full">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">Edit an Add-on</h2>
                    <p className="text-gray-600">Edit an add-on by updating details, pricing, and key benefits to promote your latest offering that align with your platform’s goals.</p>
                </div>

                <div className="my-10 max-w-full">
                    {
                        addon&&
                        <AddAddonForm addon={addon} />
                    }
                </div>
            </AdminContainer>
        </section>
    );
}

export default EditAddon;