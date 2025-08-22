import { AllBlogs, BlogCard, Container } from "../components";

function Blogs() {
    return (
        <section className="my-32">
            <Container>
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold my-5 text-blue-950">Blogs</h2>
                    <p className="text-blue-950 mt-4 mb-10">Whether you're perfecting your personal statement or navigating addendums, our blog delivers the guidance you need—one post at a time.</p>

                    <AllBlogs />
                </div>
            </Container>
        </section>
    );
}

export default Blogs;