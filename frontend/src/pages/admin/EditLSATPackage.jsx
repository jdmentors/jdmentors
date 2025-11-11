import { useParams } from "react-router";
import { AdminContainer, AddLSATPackageForm, AdminSidebar, LoadingSpinner } from "../../components";
import { useEffect, useState } from "react";
import axios from "axios";

function EditLSATPackage() {
    const { packageId } = useParams();
    const [lsatPackage, setLSATPackage] = useState(null);

    useEffect(() => {
        const getALSATPackage = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-packages/single/${packageId}`);

                if (data && data.success) {
                    setLSATPackage(data.data);
                }
            } catch (error) {
                console.error(error);
            }
        }

        getALSATPackage();
    }, [packageId])

    return (
        <section className="flex min-h-[90vh]">
            <AdminSidebar />

            <AdminContainer>
                <div className="max-w-full">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">Edit LSAT Package</h2>
                    <p className="text-gray-600">Update LSAT tutoring package details, pricing, and features to keep your offerings current and aligned with student needs.</p>
                </div>

                <div className="my-10 max-w-full">
                    {
                        lsatPackage ?
                        <AddLSATPackageForm lsatPackage={lsatPackage} />
                        :
                        <LoadingSpinner />
                    }
                </div>
            </AdminContainer>
        </section>
    );
}

export default EditLSATPackage;