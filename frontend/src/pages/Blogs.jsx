import { Link } from "react-router";
import { BlogCard, Container } from "../components";
import { ArrowRight } from "lucide-react";

function Blogs() {
    return (
        <section className="my-32">
            <Container>
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold my-5 text-blue-950">Blogs</h2>
                    <p className="text-blue-950 my-4">Whether you're perfecting your personal statement or navigating addendums, our blog delivers the guidance you need—one post at a time.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-8">
                        {
                            Array(7).fill('').map((i) => (
                                <BlogCard key={i} />
                            ))
                        }
                    </div>

                    <div className="flex justify-center mt-10">
                        <Link className="py-2.5 px-6 rounded-md bg-blue-600 text-white inline-flex items-center gap-2" to="/blogs">More Posts <ArrowRight /></Link>
                    </div>
                </div>
            </Container>
        </section>
    );
}

export default Blogs;