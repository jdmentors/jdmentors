import { Star, Verified } from "lucide-react";

function TweetCard({ card }) {
    return (
        <div className="keen-slider__slide p-4 border border-blue-100 rounded-lg shadow shadow-blue-100 ">
            <div className="flex gap-2">
                <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        <p>{card.name}</p>
                        <Verified size={18} strokeWidth={3} className="text-blue-600" />
                    </div>
                    <span className="text-xs text-slate-500">{card.school}</span>
                </div>
            </div>
            <p className="text-sm py-4 text-gray-800">{card.review}</p>
            <div className="flex items-center justify-start gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className="fill-amber-400" strokeWidth={0} />
                ))}
            </div>
        </div>
    );
}


export default TweetCard;