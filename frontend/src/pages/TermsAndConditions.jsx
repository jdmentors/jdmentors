import { Link } from "react-router";
import { Container } from "../components";

const TermsAndConditions = () => {
  return (
    <section className="my-32 text-gray-800">
      <Container>
        <h1 className="text-3xl font-bold mb-6 text-blue-950">Terms & Conditions</h1>

        <p className="mb-4">
          These Terms and Conditions govern your use of our website and services. By accessing
          or using our site, you agree to comply with these terms. Please read them carefully.
        </p>

        <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Use of Our Services</h2>
        <p className="mb-4">
          You agree to use our website and services only for lawful purposes and in a manner that
          does not infringe the rights of others or restrict their use of the site.
        </p>

        <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Account Responsibilities</h2>
        <p className="mb-4">
          If you create an account, you are responsible for maintaining the confidentiality of your
          account information and for all activities that occur under your account.
        </p>

        <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Payment & Transactions</h2>
        <p className="mb-4">
          All payments and transactions on our platform are subject to applicable laws and regulations.
          You agree to provide accurate payment information and authorize us to process payments.
        </p>

        <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Intellectual Property</h2>
        <p className="mb-4">
          All content, logos, and materials on this website are the property of our company or its
          licensors. You may not reproduce, distribute, or use them without explicit permission.
        </p>

        <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Limitation of Liability</h2>
        <p className="mb-4">
          We are not responsible for any damages arising from the use of our website or services.
          Use the site at your own risk.
        </p>

        <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Changes to Terms</h2>
        <p className="mb-4">
          We may update these Terms and Conditions from time to time. Any changes will be posted
          on this page with an updated effective date. Continued use of the site constitutes acceptance
          of the new terms.
        </p>

        <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Governing Law</h2>
        <p className="mb-4">
          These terms are governed by the laws of the jurisdiction in which our company operates.
          You agree to submit to the exclusive jurisdiction of the courts in that location.
        </p>

        <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about these Terms and Conditions, please contact us at{" "}
          <Link to={`mailto:support@jdmentors.com`} className="text-blue-600 underline">
            support@jdmentors.com
          </Link>.
        </p>
      </Container>
    </section>
  );
};

export default TermsAndConditions;