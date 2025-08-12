import { useState } from "react";
import { LoadingSpinner, ServiceCard } from "../components";
import useGetAllServices from "../hooks/useGetAllServices";
import { useEffect } from "react";

function AllServices({ limit }) {
    const [allServices, setAllServices] = useState(null);
    const getAllServices = useGetAllServices();

    useEffect(() => {
        const fetchAllServices = async () => {
            setAllServices(await getAllServices());
        }
        fetchAllServices();
    }, [])
    return (
            allServices
            ?
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-8">
                {
                    limit ?
                        allServices.slice(0, limit).map(service => (
                            service.status === true && <ServiceCard _id={service._id} key={service.title} title={service.title} description={service.description} features={service.features} price={service.price} process={service.process} />
                        ))
                        :
                        allServices.map(service => (
                            service.status === true && <ServiceCard _id={service._id} key={service.title} title={service.title} description={service.description} features={service.features} price={service.price} process={service.process} />
                        ))
                }
            </div>
            :
            <LoadingSpinner height={'450px'} />
    );
}

export default AllServices;