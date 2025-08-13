import { Link } from "react-router";
import { Container } from "../components";

const PrivacyPolicy = () => {
    return (
        <section className="my-32 text-gray-800">
            <Container>
            <h1 className="text-3xl font-bold mb-6 text-blue-950">Privacy Policy</h1>

            <p className="mb-4">
                Your privacy is important to us. This Privacy Policy explains how we
                collect, use, and protect your personal information when you use our
                website and services.
            </p>

            <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Information We Collect</h2>
            <p className="mb-4">
                We may collect personal information that you provide to us, such as your
                name, email address, phone number, and payment information. We also
                collect non-personal information automatically, such as IP address, browser
                type, and usage data.
            </p>

            <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">How We Use Information</h2>
            <p className="mb-4">
                The information we collect is used to provide and improve our services,
                process transactions, communicate with you, and personalize your experience.
            </p>

            <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Sharing Your Information</h2>
            <p className="mb-4">
                We do not sell or rent your personal information to third parties. We may
                share information with trusted service providers who help us operate our
                website and services, comply with legal obligations, or protect our rights.
            </p>

            <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Cookies & Tracking</h2>
            <p className="mb-4">
                We use cookies and similar tracking technologies to improve your experience,
                analyze usage, and deliver personalized content and ads. You can manage
                cookie preferences in your browser settings.
            </p>

            <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Your Rights</h2>
            <p className="mb-4">
                You have the right to access, correct, or delete your personal information.
                You may also opt out of certain communications. Contact us to exercise your
                rights.
            </p>

            <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Changes to This Policy</h2>
            <p className="mb-4">
                We may update this Privacy Policy from time to time. Any changes will be
                posted on this page with an updated effective date. Please review it
                periodically.
            </p>

            <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Contact Us</h2>
            <p className="mb-4">
                If you have questions or concerns about this Privacy Policy, please contact
                us at <Link to={`mailto:support@jdmentors.com`} className="text-blue-600 underline">support@jdmentors.com</Link>.
            </p>
        </Container>
        </section>
    );
};

export default PrivacyPolicy;