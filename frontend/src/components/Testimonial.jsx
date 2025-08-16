import { Star } from "lucide-react";

function Testimonial({ name, review, school, className = '' }) {
    return (
        <div className={`keen-slider__slide text-left  ${className}`}>
            <div className="h-full flex flex-col items-start border border-gray-500/30 p-5 mb-1 rounded-lg bg-white">

                <div className="flex items-center gap-3 mt-2">
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