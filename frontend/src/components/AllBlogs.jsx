import { useState } from "react";
import { BlogCard } from "../components";
import useGetAllBlogs from "../hooks/useGetAllBlogs";
import { useEffect } from "react";

function AllBlogs({limit}){
    const [allBlogs, setAllBlogs] = useState(null);
    const getAllBlogs = useGetAllBlogs();

    useEffect(() => {
        const fetchAllBlogs = async () => {
            setAllBlogs(await getAllBlogs());
        }
        fetchAllBlogs();
    }, [])

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-8">
                    {
                        allBlogs
                        &&
                        (
                            limit?
                            allBlogs.slice(0,limit).map(blog => (
                            blog.status === true && <BlogCard key={blog.title} title={blog.title} slug={blog.slug} description={blog.description} content={blog.content} image={blog.image} status={blog.status} author={blog.user} createdAt={blog.createdAt} />
                        ))
                        :
                        allBlogs.map(blog => (
                            blog.status === true && <BlogCard key={blog.title} title={blog.title} slug={blog.slug} description={blog.description} content={blog.content} image={blog.image} status={blog.status} author={blog.user} createdAt={blog.createdAt} />
                        ))
                        )
                    }
                </div>
    );
}

export default AllBlogs;