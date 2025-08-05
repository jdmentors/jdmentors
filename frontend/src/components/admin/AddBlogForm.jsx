import { RTE } from "../";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";

function AddBlogForm({post, id}){
    const navigate = useNavigate();

    const {register, handleSubmit, control, watch, setValue, getValues} = useForm({
        defaultValues:{
            title: post?.title || "",
            slug: post?.slug || "",
            content: post?.content || "",
            image: post?.featuredImage || "",
            status: post?.status || "active",
        }
    });

    const publishBlog = async(blogData) => {
        try {
            console.log(blogData);
        } catch (error) {
            console.error(error);
        }
    }

    const slugTransform = useCallback((value) => {
        if(value && typeof value === 'string'){
            return value.trim().toLowerCase().replace(/[^a-zA-Z\d\s]+/g, "-").replace(/\s/g, "-");
        }
        return "";
    })

    useEffect(() => {
        const subscription = watch(({title}, {name}) => {
            if(name === 'title'){
                setValue('slug', slugTransform(title), {shouldValidate:true});
            }
        })
        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);
    
    return (
        <form onSubmit={handleSubmit(publishBlog)}>
            <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
                <div className="border-2 border-blue-100 rounded-xl col-span-1 p-3 md:p-10 md:col-span-3 bg-blue-50">
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="title">Title:</label>
                        <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="title" type="text" {...register('title', {required:true})} placeholder="Enter blog title here..." />
                    </div>

                    <br />

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="slug">Slug:</label>
                        <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 w-full" id="slug" type="text" onInput={(e) => setValue('slug', slugTransform(e.target.value), {shouldValidate:true})} {...register('slug', {required:true})} placeholder="Enter blog slug here..." />
                    </div>

                    <br />

                    <RTE label="Content:" name="content" defaultValue={getValues("content")} control={control} />
                </div>

                <div className="border-2 border-blue-100 rounded-xl col-span-1 p-3 md:p-10 md:col-span-2 bg-blue-50">
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="image">Image:</label>
                        <input className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 cursor-pointer w-full" id="image" type="file" accept="image/png, image/jpg, image/jpeg, image/webp" label="Featured Image:" {...register('image', {required:!post})} />
                    </div>

                    <br />

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700" htmlFor="status">Status:</label>
                        <select className="border-2 bg-white border-blue-100 rounded p-2 focus:outline-2 focus:outline-blue-200 cursor-pointer w-full" id="status" {...register('status', {required:true})}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <br />

                    <button type="submit" className="p-2 w-full rounded-md text-white bg-blue-600 cursor-pointer shadow-lg shadow-blue-200">Publish</button>
                </div>
            </div>
        </form>
    );
}

export default AddBlogForm; 