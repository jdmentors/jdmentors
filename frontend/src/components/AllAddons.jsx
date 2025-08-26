import { useState } from "react";
import { LoadingSpinner, AddonCard } from "../components";
import { useEffect } from "react";
import useGetAllAddons from "../hooks/useGetAllAddons";

function AllAddons({ limit }) {
    const [allAddons, setAllAddons] = useState(null);
    const getAllAddons = useGetAllAddons();

    useEffect(() => {
        const fetchAllAddons = async () => {
            setAllAddons(await getAllAddons());
        }
        fetchAllAddons();
    }, [])
    return (
            allAddons
            ?
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-8">
                {
                    limit ?
                        allAddons.slice(0, limit).map(addon => (
                            addon.status === true && <AddonCard _id={addon._id} key={addon.title} title={addon.title} description={addon.description} price={addon.price} />
                        ))
                        :
                        allAddons.map(addon => (
                            addon.status === true && <AddonCard _id={addon._id} key={addon.title} title={addon.title} description={addon.description} price={addon.price} />
                        ))
                }
            </div>
            :
            <LoadingSpinner height={'450px'} />
    );
}

export default AllAddons;