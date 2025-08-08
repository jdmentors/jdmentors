import { useParams } from "react-router";
import { AdminContainer, AddBlogForm, AdminSidebar } from "../../components";
import { useEffect, useState } from "react";
import axios from "axios";

function EditBlog() {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);

    useEffect(() => {
        const getABlog = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/blogs/single/${slug}`);

                if (data && data.success) {
                    setBlog(data.data);
                }
            } catch (error) {
                console.error(error);
            }
        }

        getABlog();
    }, [slug])

    return (
        <section className="flex min-h-[90vh]">
            <AdminSidebar />

            <AdminContainer>
                <div className="max-w-full">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">Edit a blog</h2>
                    <p className="text-gray-600">Edit a blog by updating details, pricing, and key benefits to promote your latest offering that align with your platform’s goals.</p>
                </div>

                <div className="my-10 max-w-full">
                    {
                        blog &&
                        <AddBlogForm blog={blog} />
                    }
                </div>
            </AdminContainer>
        </section>
    );
}

export default EditBlog;