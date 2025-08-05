import { AdminContainer, AddBlogForm, AdminSidebar } from "../../components";

function AddBlog(){    
    return (
        <section className="flex min-h-[90vh]">
            <AdminSidebar />

            <AdminContainer>
                <div className="max-w-full">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">Add a Blog</h2>
                    <p className="text-gray-600">Craft a new blog post to inform, inspire, and engage your audience. Share insights, updates, or stories with your readers — one post at a time.</p>
                </div>

                <div className="my-10 max-w-full">
                    <AddBlogForm />
                </div>
            </AdminContainer>
        </section>
    );
}

export default AddBlog;