import { Star } from "lucide-react";

function Testimonial({ name, review, school, image }) {
    return (
        <div className="text-left mx-4 hover:scale-102 transition-all duration-300">
            <div className="w-84 h-full flex flex-col items-start border border-gray-500/30 p-5 rounded-lg bg-white">

                <div className="flex items-center gap-3 mt-4">
                    <img src={image} alt="user" className="w-10 h-10 object-cover rounded-full overflow-hidden" />
                    <div>
                        <h2 className="text-lg text-gray-900 font-medium">{name}</h2>
                        <p className="text-gray-500">{school}</p>
                    </div>
                </div>

                <p className="text-sm mt-3 text-gray-500 italic">{review}</p>

                <div className="flex items-center justify-center mt-3 gap-1">
                    <Star className="fill-amber-400" strokeWidth={0} />
                    <Star className="fill-amber-400" strokeWidth={0} />
                    <Star className="fill-amber-400" strokeWidth={0} />
                    <Star className="fill-amber-400" strokeWidth={0} />
                    <Star className="fill-amber-400" strokeWidth={0} />
                </div>
            </div>
        </div>
    );
}

export default Testimonial;