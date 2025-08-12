import { useState } from "react";
import { BlogCard, LoadingSpinner } from "../components";
import useGetAllBlogs from "../hooks/useGetAllBlogs";
import { useEffect } from "react";

function AllBlogs({ limit }) {
    const [allBlogs, setAllBlogs] = useState(null);
    const getAllBlogs = useGetAllBlogs();

    useEffect(() => {
        const fetchAllBlogs = async () => {
            setAllBlogs(await getAllBlogs());
        }
        fetchAllBlogs();
    }, [])

    return (
        allBlogs
        ?
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-8">
            {
                limit ?
                    allBlogs.slice(0, limit).map(blog => (
                        blog.status === true && <BlogCard key={blog.title} title={blog.title} slug={blog.slug} description={blog.description} content={blog.content} image={blog.image} status={blog.status} author={blog.user} createdAt={blog.createdAt} />
                    ))
                    :
                    allBlogs.map(blog => (
                        blog.status === true && <BlogCard key={blog.title} title={blog.title} slug={blog.slug} description={blog.description} content={blog.content} image={blog.image} status={blog.status} author={blog.user} createdAt={blog.createdAt} />
                    ))
            }
        </div>
        :
        <LoadingSpinner height={'450px'} />
    );
}

export default AllBlogs;