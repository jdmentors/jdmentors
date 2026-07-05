import { Contact as ContactForm, Container } from "../components";
import useSEO from "../hooks/useSEO";

function Contact() {
    useSEO({ title: "Contact Us", description: "Book a free consultation with JD Mentors. Fast responses, personalized 1-on-1 guidance for every part of your law school application." });
    return (
        <section className="mt-32">
            <Container>
                <h2 className="text-4xl md:text-5xl font-bold my-5 text-blue-950 text-center">Contact</h2>
            </Container>

            <ContactForm />
        </section>
    );
}

export default Contact;