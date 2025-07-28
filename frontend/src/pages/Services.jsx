import { Container, ServiceCard } from "../components";

const services = [
    {
        title: 'Personal Statement Review',
        description: 'Comprehensive 1-on-1 sessions to refine your personal statement, ensuring it effectively communicates your unique story and qualifications.',
        offers: ['Structural and content analysis', 'Grammar and style improvements', 'Strategic positioning for non-T14 schools'],
        price: 100,
        process: 'Submit your draft, Independent review, and 1-hour video consultation to refine your statement.'
    }
];

function Services() {
    return (
        <section className="mt-32 mb-16">
            <Container>
                <h2 className="text-3xl font-bold text-blue-950">Our Specialized Services</h2>
                <p className="md:text-lg text-blue-950 my-3">Tailored support to make your law school application stand out.</p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-8">
                    {
                        Array(5).fill('').map(service => (
                            <ServiceCard key={services[0].title} title={services[0].title} description={services[0].description} offers={services[0].offers} price={services[0].price} process={services[0].process} />
                        ))
                    }
                </div>
            </Container>
        </section>
    );
}

export default Services;