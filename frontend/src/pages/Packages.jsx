import { AllPackages, Container } from "../components";

function Packages() {
    return (
        <section className="mt-32 mb-16 min-h-[70vh]">
            <Container>
                <h2 className="text-3xl font-bold text-blue-950">Our Specialized Packages</h2>
                <p className="md:text-lg text-blue-950 my-3">Tailored support to make your law school application stand out.</p>

                <AllPackages />
            </Container>
        </section>
    );
}

export default Packages;