import { AllExtras, Container } from "../components";

function Extras() {
    return (
        <section className="mt-32 mb-16 min-h-[70vh]">
            <Container>
                <h2 className="text-3xl font-bold text-blue-950">Our Specialized Extras</h2>
                <p className="md:text-lg text-blue-950 mt-3 mb-7">Tailored support to make your law school application stand out.</p>

                <AllExtras />
            </Container>
        </section>
    );
}

export default Extras;