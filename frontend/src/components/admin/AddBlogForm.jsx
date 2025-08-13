import { RTE } from "../";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { banner } from "../../assets";
import useRefreshToken from "../../hooks/useRefreshToken";
import { updateUser } from "../../features/forms/UserAuthSlice";

function AddBlogForm({ blog }) {
    const navigate = useNavigate();
    const user = useSelector(state => state.user.user);
    const refreshAccessToken = useRefreshToken();
    const [isPublishing, setIsPublishing] = useState(false);
    const dispatch = useDispatch();

    const { register, handleSubmit, control, watch, setValue, getValues, reset, formState: {errors} } = useForm({
        defaultValues: {
            title: blog?.title || "",
            slug: blog?.slug || "",
            description: blog?.description || "",
            content: blog?.content || "",
            image: blog?.image || "",
            status: blog?.status || true,
        }
    });

    const publishBlog = async (blogData) => {
        try {
            const formData = new FormData();
            setIsPublishing(true);
            formData.append('title', blogData.title);
            formData.append('slug', blogData.slug);
            formData.append('description', blogData.description);
            formData.append('content', blogData.content);
            formData.append('image', blogData.image[0] || banner);
            formData.append('status', blogData.status);

            const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/blogs/create`, formData, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data && data.success) {
                toast.success(data.message);
                setIsPublishing(false);
                reset();
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            console.log(message)
            if (message === 'accessToken') {
                try {
                    console.log(blogData);
                    const newAccessToken = await refreshAccessToken();

                    const formData = new FormData();

                    formData.append('title', blogData.title);
                    formData.append('slug', blogData.slug);
                    formData.append('description', blogData.description);
                    formData.append('content', blogData.content);
                    formData.append('image', blogData.image[0]);
                    formData.append('status', blogData.status);

                    const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/blogs/create`, formData, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        toast.success(data.message);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                        reset();
                        setIsPublishing(false);
                    }
                } catch (error) {
                    const message = error?.response?.data?.message;
                    toast.error(message);
                    setIsPublishing(false);
                }
            }else{
                toast.error(message);
            }
            setIsPublishing(false);
        }
    }

    const editBlog = async (blogData) => {
        try {
            const formData = new FormData();
            setIsPublishing(true);
            formData.append('title', blogData.title);
            formData.append('slug', blogData.slug);
            formData.append('description', blogData.description);
            formData.append('content', blogData.content);
            formData.append('image', blogData.image[0] || banner);
            formData.append('status', blogData.status);

            const { data } = await axios.put(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/blogs/edit/${blog._id}`, formData, { headers: { Authorization: `Bearer ${user.accessToken}` } });

            if (data && data.success) {
                toast.success(data.message);
                setIsPublishing(false);
                navigate('/admin/blogs');
            }
        } catch (error) {
            const message = error?.response?.data?.message;
            if (message === 'accessToken') {
                try {
                    const formData = new FormData();
                    formData.append('title', blogData.title);
                    formData.append('slug', blogData.slug);
                    formData.append('description', blogData.description);
                    formData.append('content', blogData.content);
                    formData.append('image', blogData.image[0] || banner);
                    formData.append('status', blogData.status);

                    const newAccessToken = await refreshAccessToken();

                    const { data } = await axios.put(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/blogs/edit/${blog._id}`, formData, { headers: { Authorization: `Bearer ${newAccessToken}` } });

                    if (data && data.success) {
                        toast.success(data.message);
                        setIsPublishing(false);
                        dispatch(updateUser({ ...user, accessToken: newAccessToken }));
                        navigate('/admin/blogs');
                    }
                } catch (error) {
                    console.error(error);
                    const message = error?.response?.data?.message;
                    toast.error(message);
                    setIsPublishing(false);
                }
            }else{
                toast.error(message);
                setIsPublishing(false);
            }
        }
    }

    const slugTransform = useCallback((value) => {
        if (value && typeof value === 'string') {
            return value.trim().toLowerCase().replace(/[^a-zA-Z\d\s]+/g, "-").replace(/\s/g, "-");
        }
        return "";
    })

    useEffect(() => {
        const subscription = watch(({ title }, { name }) => {
            if (name === 'title') {
                setValue('slug', slugTransform(title), { shouldValidate: true });
            }
        })
        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form encType="multipart/form-data" onSubmit={blog ? handleSubmit(editBlog) : handleSubmit(publishBlog)}>
            <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
                <div className="border-2 border-blue-100 rounded-xl col-span-1 p-3 md:p-10 md:col-span-3 bg-blue-50">
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="title">Title:</label>
                        <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="title" type="text" {...register('title', { required: true })} placeholder="Enter blog title here..." />
                        {errors.title && <p className="text-sm text-orange-500 font-light">Title is required.</p>}
                    </div>

                    <br />

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="slug">Slug:</label>
                        <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="slug" type="text" onInput={(e) => setValue('slug', slugTransform(e.target.value), { shouldValidate: true })} {...register('slug', { required: true })} placeholder="Enter blog slug here..." />
                        {errors.slug && <p className="text-sm text-orange-500 font-light">Slug is required.</p>}
                    </div>

                    <br />

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="description">Description: <span className="text-sm">(No longer than 25 words or 150 characters)</span></label>
                        <textarea rows={6} className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="description" {...register('description', { required: true })} placeholder="Enter blog description here..." />
                        {errors.description && <p className="text-sm text-orange-500 font-light">Description is required.</p>}
                    </div>

                    <br />

                    <RTE label="Content:" {...register('content', { required: true })} defaultValue={getValues("content")} control={control} />
                    {errors.content && <p className="text-sm text-orange-500 font-light">Content is required.</p>}
                </div>

                <div className="border-2 border-blue-100 rounded-xl col-span-1 p-3 md:p-10 md:col-span-2 bg-blue-50">
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="image">Image:</label>
                        <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 cursor-pointer w-full" id="image" type="file" accept="image/png, image/jpg, image/jpeg, image/webp" label="Featured Image:" {...register('image', { required: !blog })} />
                        {errors.image && <p className="text-sm text-orange-500 font-light">Image is required.</p>}
                    </div>

                    <br />

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="status">Status:</label>
                        <select className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 cursor-pointer w-full" id="status" {...register('status', { required: true })}>
                            <option value={true}>Active</option>
                            <option value={false}>Inactive</option>
                        </select>
                        {errors.status && <p className="text-sm text-orange-500 font-light">Status is required.</p>}
                    </div>

                    <br />

                    <button className="p-2 w-full rounded-md text-white bg-blue-600 cursor-pointer shadow-lg shadow-blue-200" type="submit">
                        {
                            !isPublishing ? 'Publish' :
                                (<span className="flex space-x-1 items-center justify-center py-2">
                                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.1s]"></span>
                                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"></span>
                                </span>)
                        }
                    </button>
                </div>
            </div>
        </form>
    );
}

export default AddBlogForm; 