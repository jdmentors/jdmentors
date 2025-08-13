import { Link } from "react-router";
import { Container } from "../components";

function PageNotFound() {
    return (
        <section className="grid min-h-full place-items-center bg-white px-6 my-32 lg:px-8">
            <Container className="text-center">
                <p className="text-base font-semibold text-blue-600">404</p>
                <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-blue-950 sm:text-7xl">
                    Page not found
                </h1>
                <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                    Sorry, we couldn’t find the page you’re looking for.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link
                        to="/"
                        className="rounded-md bg-blue-600 px-5 py-2 text-white shadow-xs hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        Back To Home
                    </Link>
                    <Link to="/contact" className="text-gray-900">
                        Contact support <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>
            </Container>
        </section>
    )
}

export default PageNotFound;