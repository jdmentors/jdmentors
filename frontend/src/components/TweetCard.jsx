import { Star, Verified } from "lucide-react";

function TweetCard({card}) {
    return (
        <div className="p-4 border border-blue-100 rounded-lg mx-4 shadow shadow-blue-100 hover:shadow-lg transition-all duration-200 w-72 shrink-0">
            <div className="flex gap-2">
                <img className="size-10 rounded-full" loading="lazy" src={card.image} alt="User Image" />
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
                    <Star className="fill-amber-400" strokeWidth={0} />
                    <Star className="fill-amber-400" strokeWidth={0} />
                    <Star className="fill-amber-400" strokeWidth={0} />
                    <Star className="fill-amber-400" strokeWidth={0} />
                    <Star className="fill-amber-400" strokeWidth={0} />
                </div>
        </div>
    );
}

export default TweetCard;