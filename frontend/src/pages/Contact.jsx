import { Contact as ContactForm, Container } from "../components";

function Contact() {
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