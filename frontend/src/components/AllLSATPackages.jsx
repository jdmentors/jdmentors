import { useState } from "react";
import { LoadingSpinner, LSATPackageCard } from "../components";
import useGetActiveLSATPackages from "../hooks/useGetActiveLSATPackages";
import { useEffect } from "react";

function AllLSATPackages({ limit }) {
    const [allLSATPackages, setAllLSATPackages] = useState(null);
    const getActiveLSATPackages = useGetActiveLSATPackages();

    useEffect(() => {
        const fetchAllLSATPackages = async () => {
            setAllLSATPackages(await getActiveLSATPackages());
        }
        fetchAllLSATPackages();
    }, [])
    
    return (
        allLSATPackages
        ?
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {
                limit ?
                    allLSATPackages.slice(0, limit).map(lsatPackage => (
                        <LSATPackageCard 
                            key={lsatPackage._id} 
                            _id={lsatPackage._id}
                            title={lsatPackage.title} 
                            description={lsatPackage.description} 
                            sessions={lsatPackage.sessions}
                            price={lsatPackage.price}
                            originalPrice={lsatPackage.originalPrice}
                            discount={lsatPackage.discount}
                            duration={lsatPackage.duration}
                            features={lsatPackage.features}
                        />
                    ))
                    :
                    allLSATPackages.map(lsatPackage => (
                        <LSATPackageCard 
                            key={lsatPackage._id} 
                            _id={lsatPackage._id}
                            title={lsatPackage.title} 
                            description={lsatPackage.description} 
                            sessions={lsatPackage.sessions}
                            price={lsatPackage.price}
                            originalPrice={lsatPackage.originalPrice}
                            discount={lsatPackage.discount}
                            duration={lsatPackage.duration}
                            features={lsatPackage.features}
                        />
                    ))
            }
        </div>
        :
        <LoadingSpinner height={'450px'} />
    );
}

export default AllLSATPackages;