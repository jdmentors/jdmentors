import { Check, CheckCircle2, Gift, Puzzle, Settings, UserCheck2 } from "lucide-react";
import Container from "../components/Container";
import { Link, useParams } from "react-router";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { LoadingSpinner } from "../components";
import cleanFileName from "../hooks/CleanFileName";

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
                        const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/emails/order`, { fullName: sessionData.fullName, email: sessionData.email, phone: sessionData.phone, service: sessionData.service.title, addonsAndExtras: sessionData.addonsAndExtras || 'Not Included', document: sessionData.document, dateTime: sessionData.dateTime, notes: sessionData.notes || 'Not Provided', price: sessionData.price, sessionId: sessionData._id });
                    } catch (error) {
                        console.error(error);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
        getSession();
    }, [sessionId])

    return (
        <section className="my-32">
            <Container>
                <div className="flex justify-center items-center flex-col gap-2 w-full sm:max-w-xl sm:mx-auto sm:text-center">
                    <CheckCircle2 size={60} className="text-green-600 mb-4" />
                    <h2 className="text-3xl font-bold text-blue-950">
                        Thank You For Your Booking
                    </h2>
                    <p className="text-gray-600 mb-8">
                        We've received your order. We'll reach out to you soon. Please keep an eye on your email.
                    </p>
                    {
                        session
                            ?
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
                                        <p className="text-gray-600 mb-4 text-left">
                                            {session.service.description}
                                        </p>

                                        {
                                            session.service.features && session.service.features.length > 0 &&
                                            <>
                                                <p className="text-gray-600 my-2 font-semibold text-left">Features:</p>
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
                                            </>
                                        }

                                        {
                                            session.service.services && session.service.services.length > 0 &&
                                            <>
                                                <p className="text-gray-600 my-2 font-semibold text-left">Services:</p>
                                                <ul className="text-gray-600 space-y-2">
                                                    {
                                                        session.service.services.map(service => (
                                                            <li key={service} className="flex items-start gap-1">
                                                                <Settings className="text-blue-600" size={18} />
                                                                <span>{service}</span>
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            </>
                                        }

                                        {
                                            session.addonsAndExtras && session.addonsAndExtras.length > 0 &&
                                            <>
                                                <p className="text-gray-600 my-2 font-semibold text-left">Add-ons & Extras:</p>
                                                <ul className="text-gray-600 space-y-2">
                                                    {
                                                        session.addonsAndExtras.map(addonAndExtra => (
                                                            <li key={addonAndExtra} className="flex items-start gap-1">
                                                                <Puzzle className="text-blue-600" size={18} />
                                                                <span>{addonAndExtra}</span>
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            </>
                                        }

                                        <div className="mt-5 text-gray-600 flex flex-col gap-3">
                                            <p className="flex justify-between">Preferred Time: <span>{session.dateTime ? new Date(session.dateTime).toDateString() + " " + `(${new Date(session.dateTime).toLocaleTimeString()})` : 'Not Specified'}</span></p>
                                            <div className="flex justify-between">
                                                Document:
                                                <div>
                                                    {session.document.map(document => {
                                                        return (<p key={document}>
                                                            <Link target="_blank" to={document} className="text-blue-600 underline">{cleanFileName(decodeURIComponent(document))}</Link>
                                                        </p>)
                                                    })}
                                                </div>
                                            </div>
                                            <p className="flex justify-between">Total Price: <span className="font-semibold text-xl text-black">${Math.round(session.price)}</span></p>
                                        </div>
                                    </div>
                                </section>
                            )
                            :
                            <LoadingSpinner />
                    }

                    <Link to={`/`} className="border-2 border-blue-100 rounded-md py-2 px-5">Back To Home</Link>
                </div>
            </Container>
        </section>
    );
}

export default CheckOutSuccess;