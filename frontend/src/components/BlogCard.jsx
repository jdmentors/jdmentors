import { Link } from "react-router";
import { aboutUs, omar } from "../assets";

function BlogCard() {
    return (
        <Link className="border border-blue-100 rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-blue-100 hover:-translate-y-1 transition-all duration-200">
            <img src={aboutUs} alt="blogImg" className="h-52 sm:h-65 lg:h-52 xl:h-65 w-full object-cover" />

            <div>
                <div className="flex justify-between px-5 pt-5 pb-3 text-gray-700">
                    <div className="flex items-center gap-2">
                        <img src={omar} alt="author" className="h-8 w-8 object-cover rounded-full" />
                        <p className="font-semibold">Alan Parker</p>
                    </div>
                    <p>30 June, 2025</p>
                </div>

                <div className="px-5 pb-5">
                    <h5 className="text-lg text-blue-950 font-semibold">Why Your Personal Statement Matters More Than You Think</h5>

                    <p className="text-gray-600">
                        When it comes to law school admissions, your personal statement isn’t just another requirement—it’s your voice.
                    </p>
                </div>

                {/* <button className="w-full p-3 text-white bg-blue-600 cursor-pointer ">Read More</button> */}
            </div>
        </Link>
    );
}

export default BlogCard;