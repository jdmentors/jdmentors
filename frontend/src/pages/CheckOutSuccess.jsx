import { Check, CheckCircle2, UserCheck2 } from "lucide-react";
import Container from "../components/Container";
import { Link, useParams } from "react-router";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

function CheckOutSuccess() {
    const { sessionId } = useParams();
    const [session, setSession] = useState(null);

    useEffect(() => {
        const getSession = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/sessions/single/${sessionId}`);

                if (data && data.success) {
                    setSession(data.data);
                    const sessionData = data.data;
                    try {
                        const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/emails/order`, {fullName: sessionData.user.fullName, email: sessionData.user.email, phone: sessionData.user.phone, service: sessionData.service.title, document: sessionData.document, dateTime: sessionData.dateTime, price: sessionData.service.price});
                    } catch (error) {
                        console.error(error);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
        getSession();
    }, [])

    return (
        <section className="my-32">
            <Container>
                <div className="flex justify-center items-center flex-col gap-2 w-full sm:max-w-xl sm:mx-auto sm:text-center">
                    <CheckCircle2 size={60} className="text-green-600 mb-4" />
                    <h2 className="text-3xl font-bold text-blue-950">
                        Thank You For Your Booking
                    </h2>
                    <p className="text-gray-600 mb-8">
                        We've received your order. We'll reach out to you soon. Keep checking your mail.
                    </p>

                    {
                        session
                        &&
                        (
                            <section>
                                <h3 className="font-semibold text-blue-950">Booking Summary</h3>

                                <div className="bg-blue-50 border border-blue-100 p-5 rounded-md mb-8 mt-5 md:sticky md:top-20 shadow-lg shadow-blue-100">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-blue-100 p-2.5 rounded-full mr-4 w-10 h-10 flex items-center justify-center">
                                            <UserCheck2 className="text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-blue-950">{session.service.title}</h3>
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        {session.service.description}
                                    </p>
                                    <ul className="text-gray-600 space-y-2">
                                        {
                                            session.service.features.map(feature => (
                                                <li key={feature} className="flex items-start gap-1">
                                                    <Check className="text-blue-600" size={18} />
                                                    <span>{feature}</span>
                                                </li>
                                            ))
                                        }
                                    </ul>

                                    <div className="mt-5 text-gray-600">
                                        <p className="flex justify-between">Preferred Time: <span>{new Date(session.dateTime).toDateString()}</span></p>
                                        <p className="flex justify-between">Document: <Link target="_blank" to={session.document} className="text-blue-600 underline">File</Link></p>
                                        <p className="flex justify-between">Total Price: <span className="font-semibold text-xl text-black">${session.service.price}</span></p>
                                    </div>
                                </div>
                            </section>
                        )
                    }

                    <Link to={`/`} className="border-2 border-blue-100 rounded-md py-2 px-5">Back To Home</Link>
                </div>


            </Container>
        </section>
    );
}

export default CheckOutSuccess;