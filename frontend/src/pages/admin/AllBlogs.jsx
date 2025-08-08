import { AdminContainer, AdminSidebar } from "../../components";
import { Pencil, Plus, Trash } from "lucide-react";
import { banner, user } from "../../assets";
import { Link } from "react-router";
import { useState } from "react";
import useGetAllBlogs from "../../hooks/useGetAllBlogs";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../features/forms/UserAuthSlice";
import toast from "react-hot-toast";
import useRefreshToken from "../../hooks/useRefreshToken";

function AllBlogs() {
    const [allBlogs, setAllBlogs] = useState(null);
    const getAllBlogs = useGetAllBlogs();
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();
    const refreshAccessToken = useRefreshToken();

    useEffect(() => {
        const fetchAllBlogs = async () => {
            setAllBlogs(await getAllBlogs());
        }
        fetchAllBlogs();
    }, [])

    const handleDeleteBlog = async (id) => {
        try {
            const { data } = await axios.delete(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/blogs/delete/${id}`, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data && data.success) {
                toast.success(data.message);
                setAllBlogs(prevblogs => prevblogs.filter(blog => blog._id.toString() !== id.toString()));
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.delete(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/blogs/delete/${id}`, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        toast.success(data.message);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                        setAllBlogs(prevblogs => prevblogs.filter(blog => blog._id.toString() !== id.toString()));
                    }
                } catch (error) {
                    toast.error(error?.response?.data?.message);
                }
            }
        }
    }

    const handleUpdateAvailability = async (id, e) => {
        try {
            const { data } = await axios.patch(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/blogs/availability/${id}`, { status: e.target.checked }, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data && data.success) {
                toast.success(data.message);
                setAllBlogs(blogs =>
                    blogs.map(blog =>
                        blog._id === id
                            ? { ...blog, status: data.data.status }
                            : blog
                    )
                );
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.patch(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/blogs/availability/${id}`, { status: e.target.checked }, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        toast.success(data.message);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                        setAllBlogs(blogs =>
                            blogs.map(blog =>
                                blog._id === id
                                    ? { ...blog, status: data.data.status }
                                    : blog
                            )
                        );

                    }
                } catch (error) {
                    toast.error(error?.response?.data?.message);
                }
            }
        }
    }

    return (
        <section className="flex min-h-[90vh]">
            <AdminSidebar />

            <AdminContainer>
                <div className="max-w-full relative">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">All Blogs</h2>
                    <p className="text-gray-600">Edit, publish, or delete content effortlessly to keep your site fresh and relevant. Oversee all published blogs to ensure consistency and quality.</p>

                    <br />

                    <Link className="bg-blue-600 py-3 px-6 rounded-md text-white cursor-pointer sm:absolute sm:right-0 sm:top-0 flex items-center gap-1 justify-start max-w-max" to="/admin/blogs/add"><Plus size={18} strokeWidth={3} /><span>Add Blog</span></Link>
                </div>

                <div className="my-10 max-w-full">
                    <div className="overflow-hidden rounded-2xl border-2 border-blue-100 bg-white px-4 pb-3 pt-4 sm:px-6">
                        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">All Blogs</h3>
                        </div>

                        <div className="my-5 overflow-x-auto">
                            <div className="hidden sm:grid grid-cols-[175px_1fr_2fr_75px_1fr] gap-5 items-center py-3 border-b-2 border-b-blue-100">
                                <h5 className="text-lg">Image</h5>
                                <h5 className="text-lg">Title</h5>
                                <h5 className="text-lg">Description</h5>
                                <h5 className="text-lg">Status</h5>
                                <h5 className="text-lg">Action</h5>
                            </div>

                            {
                                allBlogs
                                &&
                                (
                                    <>
                                        <div className="hidden sm:block">
                                            {
                                                allBlogs.map(blog => (
                                                    <div key={blog._id} className="md:grid grid-cols-[175px_1fr_2fr_75px_1fr] gap-5 items-center py-5 text-gray-600">
                                                        <img src={blog.image || banner} alt="blogImg" className="w-40 h-24 object-cover rounded" />

                                                        <p className="">
                                                            {blog.title}
                                                        </p>

                                                        <p>{blog.description}</p>

                                                        <label className="relative cursor-pointer">
                                                            <input type="checkbox" checked={blog.status} onChange={(e) => handleUpdateAvailability(blog._id, e)} className="sr-only peer" />

                                                            <div className="w-12 h-7 peer-checked:bg-blue-600 bg-blue-200 border border-blue-200 rounded-full transition-colors duration-200"></div>

                                                            <span className="h-5 w-5 bg-white rounded-full absolute top-1/2 -translate-y-1/2 peer-checked:translate-x-full mx-1 transition duration-200"></span>
                                                        </label>

                                                        <div className="flex gap-3">
                                                            <Link to={`/admin/blogs/edit/${blog.slug}`} className="bg-green-600 px-4 py-3 rounded-md text-white max-w-max cursor-pointer"><Pencil size={18} /></Link>
                                                            <button onClick={() => handleDeleteBlog(blog._id)} className="bg-red-600 px-4 py-3 rounded-md text-white max-w-max cursor-pointer"><Trash size={18} /></button>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <div className="sm:hidden">
                                            {
                                                allBlogs.map(blog => (
                                                    <div key={blog._id} className="flex flex-col gap-3 py-5 text-gray-600 border-b-2 border-b-blue-100">
                                                        <div className="flex gap-4">
                                                            {/* <p className="text-gray-800">Image:</p> */}
                                                            <img src={banner} alt="" className="w-full h-40 object-cover rounded" />
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Title:</p>
                                                            <p>
                                                                {blog.title}
                                                            </p>
                                                        </div>

                                                        <div className="flex flex-col gap-4">
                                                            <p className="text-gray-800">Description:</p>
                                                            <p>{blog.description}</p>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Status:</p>
                                                            <label className="relative cursor-pointer">
                                                                <input type="checkbox" checked={blog.status} onChange={(e) => handleUpdateAvailability(blog._id, e)} className="sr-only peer" />

                                                                <div className="w-12 h-7 peer-checked:bg-blue-600 bg-blue-200 border border-blue-200 rounded-full transition-colors duration-200"></div>

                                                                <span className="h-5 w-5 bg-white rounded-full absolute top-1/2 -translate-y-1/2 peer-checked:translate-x-full mx-1 transition duration-200"></span>
                                                            </label>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <p className="text-gray-800">Actions:</p>

                                                            <div className="flex flex-wrap gap-3">
                                                                <Link to={`/admin/blogs/edit/${blog.slug}`} className="bg-green-600 px-4 py-3 rounded-md text-white max-w-max cursor-pointer"><Pencil size={18} /></Link>
                                                                <button onClick={() => handleDeleteBlog(blog._id)} className="bg-red-600 px-3 py-1 rounded-md text-white max-w-max cursor-pointer">Delete</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
            </AdminContainer>
        </section>
    );
}

export default AllBlogs;