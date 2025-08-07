import { useState } from "react";
import { ServiceCard } from "../components";
import useGetAllServices from "../hooks/useGetAllServices";
import { useEffect } from "react";

function AllServices({limit}){
    const [allServices, setAllServices] = useState(null);
    const getAllServices = useGetAllServices();

    useEffect(() => {
        const fetchAllServices = async () => {
            setAllServices(await getAllServices());
        }
        fetchAllServices();
    }, [])
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-8">
                    {
                        allServices
                        &&
                        (
                            limit?
                            allServices.slice(0,limit).map(service => (
                            <ServiceCard key={service.title} title={service.title} description={service.description} features={service.features} price={service.price} process={service.process} />
                        ))
                        :
                        allServices.map(service => (
                            <ServiceCard key={service.title} title={service.title} description={service.description} features={service.features} price={service.price} process={service.process} />
                        ))
                        )
                    }
                </div>
    );
}

export default AllServices;