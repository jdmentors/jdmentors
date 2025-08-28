import { useState } from "react";
import { LoadingSpinner, ExtraCard } from "../components";
import { useEffect } from "react";
import useGetAllExtras from "../hooks/useGetAllExtras";

function AllExtras({ limit }) {
    const [allExtras, setAllExtras] = useState(null);
    const getAllExtras = useGetAllExtras();

    useEffect(() => {
        const fetchAllExtras = async () => {
            setAllExtras(await getAllExtras());
        }
        fetchAllExtras();
    }, [])
    return (
            allExtras
            ?
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-8">
                {
                    limit ?
                        allExtras.slice(0, limit).map(extra => (
                            extra.status === true && <ExtraCard _id={extra._id} key={extra.title} title={extra.title} description={extra.description} price={extra.price} />
                        ))
                        :
                        allExtras.map(extra => (
                            extra.status === true && <ExtraCard _id={extra._id} key={extra.title} title={extra.title} description={extra.description} price={extra.price} />
                        ))
                }
            </div>
            :
            <LoadingSpinner height={'450px'} />
    );
}

export default AllExtras;