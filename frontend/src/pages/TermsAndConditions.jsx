import { Link } from "react-router";
import { Container } from "../components";

const TermsAndConditions = () => {
  return (
    <section className="my-32 text-gray-800">
      <Container>
        <h1 className="text-4xl md:text-5xl font-bold my-5 text-blue-950">Terms & Conditions</h1>

        <p className="mb-4">
          These Terms & Conditions (“Terms”) govern your use of JD Mentors’ website and consulting services. By using our site or booking services, you acknowledge that you have read, understood, and agreed to these Terms.
        </p>

        <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Purpose of Services</h2>
        <p className="mb-4">
          JD Mentors provides admissions consulting, essay reviews, and related guidance to help clients improve the quality of their law school applications. <br /><br />
          We do not guarantee that any client will be admitted to law school, receive scholarship funds, or achieve any specific result. All decisions on admissions, financial aid, or scholarships are made solely by the law schools and other independent bodies.
        </p>

        <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Client Responsibilities</h2>
        <div className="mb-4">
          <p>You understand and agree that:</p>
          <ul >
            <li>- You are solely responsible for the accuracy, completeness, and timeliness of your application materials.</li>
            <li>- You are solely responsible for submitting all required materials to law schools and meeting deadlines.</li>
            <li>- You are solely responsible for your own performance in any interviews, exams (including the LSAT), or other admissions-related activities.</li>
            <li>- JD Mentors is a guidance and advisory service only. Your effort, qualifications, and presentation ultimately determine your outcome.</li>
          </ul>
        </div>

        <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">No Guarantee of Results</h2>
        <div className="mb-4">
          <ul >
            <li>- JD Mentors cannot and does not guarantee admission to any law school.</li>
            <li>- JD Mentors cannot and does not guarantee scholarship awards or financial aid.</li>
            <li>- Any examples of past client successes are for illustrative purposes only and do not represent a promise of future results. Your outcome depends on factors outside our control, including but not limited to: academic record, LSAT scores, letters of recommendation, competition level, and the discretion of each law school.</li>
          </ul>
        </div>

        <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Limitation of Liability</h2>
        <div className="mb-4">
          <p>To the fullest extent permitted by law:</p>
          <ul >
            <li>- JD Mentors shall not be liable for any losses, damages, or costs (including lost opportunities or scholarships) arising from the use of our services.</li>
            <li>- You agree to use our services at your own risk.</li>
            <li>- If, despite these terms, JD Mentors is found liable for any reason, our maximum liability will be limited to the total amount you have paid us for the services in question.</li>
          </ul>
        </div>

        <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Use of Services</h2>
        <div className="mb-4">
          <ul >
            <li>- You agree to use our services only for lawful purposes and in compliance with all applicable laws. You may not misuse our site, copy our materials, or engage in fraudulent activity.</li>
            <li>- All materials, edits, feedback, and recommendations provided by JD Mentors are intended solely for educational purposes and as guidance to improve your own work. You may not submit our work, in whole or in part, as your own original creation to any academic institution, admissions committee, or other third party.</li>
          </ul><br />

          <p>By using our services, you acknowledge and agree that:</p>

          <ul >
            <li>- Our deliverables are suggestions and examples only, not final, ready-to-submit documents.</li>
            <li>- You are solely responsible for making all final decisions about your application content, structure, and submission.</li>
            <li>- Any plagiarism or misrepresentation resulting from improper use of our services is strictly prohibited and is entirely your responsibility.</li>
            <li>- JD Mentors operates as a consulting and coaching service, not as a ghostwriting, application submission, or guaranteed-admission provider.</li>
          </ul>
        </div>

        <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Payments & Transactions</h2>
        <ul >
          <li>- All fees must be paid in full before services are rendered unless otherwise agreed in writing.</li>
          <li>- You authorize JD Mentors to process payment through your selected payment method.</li>
          <li>- Additional services or rush requests may incur extra fees.</li>
        </ul>

        <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Intellectual Property</h2>
        <p className="mb-4">
          All content, branding, templates, and resources provided by JD Mentors are our exclusive property or licensed to us. You may not reproduce, share, use, or resell these materials without permission.
        </p>

        <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Refund Policy</h2>
        <p className="mb-4">
          See our separate Refund Policy for details on cancellations, rescheduling, and refunds. In short, refunds are not provided after a session or service has been delivered.
        </p>

        <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Changes to Terms</h2>
        <p className="mb-4">
          We may revise these Terms at any time. Updates will be posted on this page with a new effective date. Your continued use of our services after changes are posted means you accept the updated terms.
        </p>

        <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Governing Law</h2>
        <p className="mb-4">
          These Terms are governed by the laws of the State of New York. You agree to submit to the exclusive jurisdiction of New York courts.
        </p>

        <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Contact Us</h2>
        <p className="mb-4">
          For questions about these Terms, email: &nbsp;
          <Link to={`mailto:support@jdmentors.com`} className="text-blue-600 underline">
            support@jdmentors.com
          </Link>.
        </p>

        <h2 className="text-2xl text-blue-950 font-semibold mt-6 mb-4">Refund Policy</h2>
        <div className="mb-4">
          <p className="font-semibold">Session Bookings (Hourly Services)</p>
          <p>Rescheduling: You may reschedule up to 24 hours before your session without penalty.</p>
          <p>Cancellations within 24 hours: These cannot be refunded but can be rescheduled once.</p>
          <p>Missing the session without notice: This counts as a completed session, no refund.</p>
          <br />
          <p className="font-semibold">Packages & Prepaid Services</p>
          <p>Non-refundable once booked, with limited exceptions under extraordinary circumstances. Please contact us promptly if the need arises.</p>
          <br />
          <p className="font-semibold">Add-ons & Deliverable Services</p>
          <p>If you purchase add-ons, these are non-refundable once your order has been marked as completed.</p>
        </div>
      </Container>
    </section>
  );
};

export default TermsAndConditions;