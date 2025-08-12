import { Link } from "react-router";
import { aboutUs, user } from "../assets";

function BlogCard({title, slug, description, content, image, status, author, createdAt}) {
    return (
        <Link to={`/blogs/${slug}`} className="border border-blue-100 rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-blue-100 hover:-translate-y-1 transition-all duration-200">
            <img src={image || aboutUs} alt="blogImg" loading="lazy" className="h-52 sm:h-65 lg:h-52 xl:h-65 w-full object-cover" />

            <div>
                <div className="flex justify-between px-5 pt-5 pb-3 text-gray-700">
                    <div className="flex items-center gap-2">
                        <img src={author.image || user} loading="lazy" alt="author" className="h-8 w-8 object-cover rounded-full" />
                        <p className="font-semibold">{author.fullName}</p>
                    </div>
                    <p>{new Date(createdAt).toDateString()}</p>
                </div>

                <div className="px-5 pb-5">
                    <h5 className="text-lg text-blue-950 font-semibold">{title}</h5>

                    <p className="text-gray-600">
                        {description}
                    </p>
                </div>
            </div>
        </Link>
    );
}

export default BlogCard;