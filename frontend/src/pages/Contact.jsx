import { Contact as ContactForm, Container } from "../components";

function Contact() {
    return (
        <section className="mt-32">
            <Container>
                <h2 className="text-4xl md:text-5xl font-bold my-5 text-blue-950">Contact</h2>
                <p className="text-blue-950 mt-4 mb-10">Have a question about your documents or need some guidance? Reach out—our team is ready to provide the clarity and answers you need.</p>
            </Container>

            <ContactForm />
        </section>
    );
}

export default Contact;