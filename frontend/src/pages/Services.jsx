import { AllExtras, AllPackages, AllServices, Container } from "../components";

function Services() {
    return (
        <div className="mt-32 mb-16 min-h-[70vh]">
            <section className="my-14">
                <Container>
                    <h2 className="text-3xl font-bold text-blue-950">All-In-One Solutions</h2>
                    <p className="md:text-lg text-blue-950 mt-3 mb-10">Full-service guidance designed to maximize admissions and scholarship results.</p>

                    <AllPackages />
                </Container>
            </section>

            <section className="">
                <Container>
                    <h2 className="text-3xl font-bold text-blue-950">Focused Support</h2>
                    <p className="md:text-lg text-blue-950 my-3">Get focused help on the parts of your application that matter most.</p>

                    <AllServices />
                </Container>
            </section>

            <section className="my-14">
                <Container>
                    <h2 className="text-3xl font-bold text-blue-950">Beyond the Application</h2>
                    <p className="md:text-lg text-blue-950 mt-3 mb-7">Additional services to help you stand out beyond admissions.</p>

                    <AllExtras />
                </Container>
            </section>
        </div>
    );
}

export default Services;