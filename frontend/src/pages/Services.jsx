import { AllExtras, AllPackages, AllServices, Container } from "../components";

function Services() {
    return (
        <div className="mt-32 mb-16 min-h-[70vh]">
            <section className="my-14">
                <Container>
                    <h2 className="text-3xl font-bold text-blue-950">Our Specialized Packages</h2>
                    <p className="md:text-lg text-blue-950 my-3">Tailored support to make your law school application stand out.</p>

                    <AllPackages />
                </Container>
            </section>

            <section className="">
                <Container>
                    <h2 className="text-3xl font-bold text-blue-950">Our Specialized Services</h2>
                    <p className="md:text-lg text-blue-950 my-3">Tailored support to make your law school application stand out.</p>

                    <AllServices />
                </Container>
            </section>

            <section className="my-14">
            <Container>
                <h2 className="text-3xl font-bold text-blue-950">Our Specialized Extras</h2>
                <p className="md:text-lg text-blue-950 mt-3 mb-7">Tailored support to make your law school application stand out.</p>

                <AllExtras />
            </Container>
        </section>
        </div>
    );
}

export default Services;