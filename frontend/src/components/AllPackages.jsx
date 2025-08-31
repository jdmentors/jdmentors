import { useState } from "react";
import { LoadingSpinner, PackageCard } from "../components";
import useGetAllPackages from "../hooks/useGetAllPackages";
import { useEffect } from "react";

function AllPackages({ limit }) {
    const [allPackages, setAllPackages] = useState(null);
    const getAllPackages = useGetAllPackages();

    useEffect(() => {
        const fetchAllPackages = async () => {
            setAllPackages(await getAllPackages());
        }
        fetchAllPackages();
    }, [])
    
    return (
            allPackages
            ?
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-8">
                {
                    limit ?
                        allPackages.slice(0, limit).map(ourPackge => (
                            ourPackge.status === true && <PackageCard _id={ourPackge._id} key={ourPackge.title} title={ourPackge.title} description={ourPackge.description} services={ourPackge.services} addons={ourPackge.addons} extras={ourPackge.extras} price={ourPackge.price} process={ourPackge.process} />
                        ))
                        :
                        allPackages.map(ourPackge => (
                            ourPackge.status === true && <PackageCard _id={ourPackge._id} key={ourPackge.title} title={ourPackge.title} description={ourPackge.description} services={ourPackge.services} addons={ourPackge.addons} extras={ourPackge.extras} price={ourPackge.price} process={ourPackge.process} />
                        ))
                }
            </div>
            :
            <LoadingSpinner height={'450px'} />
    );
}

export default AllPackages;