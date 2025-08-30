import { Link } from "react-router";
import { Container } from "../components";

const PrivacyPolicy = () => {
    return (
        <section className="my-32 text-gray-800">
            <Container>
                <h1 className="text-4xl md:text-5xl font-bold my-5 text-blue-950">Privacy Policy</h1>

                <p className="mb-4">
                    This Privacy Policy explains how we collect, use, store, and protect your information when you use our website and services. By using our website, you agree to the terms outlined here.
                </p>

                <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Information We Collect</h2>
                <div className="mb-4">
                    <p>We may collect the following types of information:</p>
                    <ul >
                        <li>- Personal Information (provided by you):</li>
                        <ul>
                            <li>-- Name, email address, phone number</li>
                            <li>-- Payment and billing details</li>
                            <li>-- Any information you submit via forms, consultations, or communications with us</li>
                        </ul>
                        <li>- Non-Personal Information (collected automatically):</li>
                        <ul>
                            <li>--  address, browser type, device type, operating system</li>
                            <li>-- Website usage data, pages visited, and referral links</li>
                        </ul>
                    </ul>
                </div>

                <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">How We Use Your Information</h2>
                <div className="mb-4">
                    <p>We use your information to:</p>
                    <ul >
                        <li>- Provide, operate, and improve our services</li>
                        <li>- Process transactions securely</li>
                        <li>- Communicate with you about your account, services, or inquiries</li>
                        <li>- Customize your experience and deliver relevant content</li>
                        <li>- Comply with applicable laws and regulations</li>
                    </ul>
                </div>

                <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Sharing Your Information</h2>
                <div className="mb-4">
                    <p>We do not sell or rent your personal information.</p>
                    <p>We may share information only with:</p><br />
                    <ul >
                        <li>- Trusted service providers who help operate our website, payment processing, or communications.</li>
                        <li>- Legal authorities, if required by law or to protect our rights and property.</li>
                        <li>- Third-party analytics or advertising partners, but only in anonymized or aggregated form.</li>
                    </ul>
                </div>

                <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Cookies & Tracking</h2>
                <div className="mb-4">
                    <p>Our site uses cookies, pixels, and similar technologies to:</p>
                    <ul >
                        <li>- Improve site performance</li>
                        <li>- Analyze visitor behavior</li>
                        <li>- Deliver personalized marketing</li>
                    </ul>
                    <p>You may adjust cookie settings in your browser, but this may impact certain features</p>
                </div>

                <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">You have the right to:</h2>
                <div className="mb-4">
                    <ul >
                        <li>- Access, update, or delete your personal data</li>
                        <li>- Opt out of marketing communications</li>
                        <li>- Request a copy of the data we hold about you</li>
                    </ul><br />

                    <p>Contact us at <Link className="text-blue-600 underline" to={`mailto:contact@jdmentors.com`}>contact@jdmentors.com</Link> to exercise these rights.</p>
                </div>


                <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Data Security</h2>
                <p className="mb-4">We implement industry-standard security measures to protect your data from unauthorized access or disclosure. However, no online transmission is completely secure, and we cannot guarantee absolute security.</p>

                <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Educational Use & No Guarantee Disclaimer</h2>
                <p className="mb-4">
                    All services and materials provided by JD Mentors are for educational purposes only. We do not guarantee admission to any law school, specific scholarship outcomes, or any particular result from using our services. Final admissions decisions are made solely by law schools and related institutions, and your success will depend on factors beyond our control.
                </p>

                <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Limitation of Liability</h2>
                <div className="mb-4">
                    <p>JD Mentors is not liable for:</p>
                    <ul >
                        <li>- Decisions made by educational institutions</li>
                        <li>- Missed deadlines, incorrect submissions, or incomplete applications</li>
                        <li>- Any loss, damage, or perceived negative outcome resulting from the use of our services</li>
                    </ul>
                    <p>By using our services, you acknowledge that you are solely responsible for your application process, communications with schools, and final submissions.</p>
                </div>

                <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Changes to This Policy</h2>
                <p className="mb-4">
                    We may update this Privacy Policy at any time. Changes will be posted on this page with a revised “Effective Date.” Continued use of our services after changes means you accept the updated terms.
                </p>

                <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Contact Us</h2>
                <p className="mb-4">
                    For questions about these Terms, email: &nbsp;
                    <Link to={`mailto:support@jdmentors.com`} className="text-blue-600 underline">
                        support@jdmentors.com
                    </Link>.
                </p>
            </Container>
        </section>
    );
};

export default PrivacyPolicy;