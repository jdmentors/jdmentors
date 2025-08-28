import { useParams } from "react-router";
import { AdminContainer, AddPackageForm, AdminSidebar } from "../../components";
import { useEffect, useState } from "react";
import axios from "axios";

function EditPackage() {
    const { packageId } = useParams();
    const [ourPackage, setOurPackage] = useState(null);

    useEffect(() => {
        const getAPackage = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/packages/single/${packageId}`);

                if (data && data.success) {
                    setOurPackage(data.data);
                }
            } catch (error) {
                console.error(error);
            }
        }

        getAPackage();
    }, [packageId])

    return (
        <section className="flex min-h-[90vh]">
            <AdminSidebar />

            <AdminContainer>
                <div className="max-w-full">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">Edit a Package</h2>
                    <p className="text-gray-600">Edit a package by updating details, pricing, and key benefits to promote your latest offering that align with your platform’s goals.</p>
                </div>

                <div className="my-10 max-w-full">
                    {
                        ourPackage&&
                        <AddPackageForm ourPackage={ourPackage} />
                    }
                </div>
            </AdminContainer>
        </section>
    );
}

export default EditPackage;