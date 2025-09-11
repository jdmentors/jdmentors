import { CheckCircle2, UserCheck2 } from "lucide-react";
import Container from "../components/Container";
import { Link, useParams } from "react-router";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { LoadingSpinner } from "../components";
import cleanFileName from "../hooks/CleanFileName";

function CheckOutAccommodationSuccess() {
    const { accommodationId } = useParams();
    const [accommodation, setAccommodation] = useState(null);

    useEffect(() => {
        const getAccommodation = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/accommodations/single/${accommodationId}`);

                if (data && data.success) {
                    setAccommodation(data.data);
                    console.log(data.data)
                    const accommodationData = data.data;
                    if (!accommodationData.emailSent) {
                        try {
                            const { data } = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/emails/accommodation`, {
                                fullName: accommodationData.fullName,
                                email: accommodationData.email,
                                phone: accommodationData.phone,
                                preferredContact: accommodationData.preferredContact,
                                otherContactMethod: accommodationData.otherContactMethod,
                                exam: accommodationData.exam,
                                seekingAccommodations: accommodationData.seekingAccommodations,
                                supportingDocumentation: accommodationData.supportingDocumentation,
                                previousAccommodation: accommodationData.previousAccommodation,
                                providedAccommodations: accommodationData.providedAccommodations,
                                additionalInfomation: accommodationData.additionalInfomation,
                                document: accommodationData.document,
                                dateTime: accommodationData.dateTime,
                                price: accommodationData.price,
                                payment: accommodationData.payment,
                                accommodationId: accommodationData._id
                            });

                            if(data && data.success){
                                const { data } = await axios.patch(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/accommodations/email-status/${accommodationId}`, {emailSent: true});
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
        getAccommodation();
    }, [accommodationId])

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
                        accommodation
                            ?
                            (
                                <section>
                                    <h3 className="font-semibold text-blue-950">Booking Summary</h3>

                                    <div className="bg-blue-50 border border-blue-100 p-5 rounded-md mb-8 mt-5 md:sticky md:top-20 shadow-lg shadow-blue-100">
                                        <div className="flex items-center mb-4">
                                            <div className="bg-blue-100 p-2.5 rounded-full mr-4 w-10 h-10 flex items-center justify-center">
                                                <UserCheck2 className="text-blue-600" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-blue-950">Accommodations</h3>
                                        </div>

                                        <p className="text-gray-600 mb-4 text-left">
                                            Get the support you deserve to succeed at every step of your law journey — from the LSAT, GRE, MPRE, Grad school, and admissions to law school exams, interviews, and the bar.
                                        </p>

                                        <p className="text-gray-600 mb-4 text-left">
                                            We support and empower students with cognitive, physical, and mental health challenges by providing advocacy and guidance, ensuring you can fully focus on your LSAT exam and future goals.
                                        </p>

                                        <div className="mt-5 text-gray-600 flex flex-col gap-3">

                                            <p className="flex justify-between">Preferred Contact Method: <span>{typeof accommodation.preferredContact == 'object'
                                                ?
                                                accommodation.preferredContact
                                                    .map(preferred => preferred.split(',')[0])
                                                    .join(', ')
                                                :
                                                'Not Specified'}</span></p>

                                            <p className="flex justify-between">Exam/Program: <span>{
                                                typeof accommodation.exam == 'object' && accommodation.exam.length > 0
                                                    ?
                                                    accommodation.exam
                                                        .map(ex => ex.split(',')[0])
                                                        .join(', ')
                                                    : 'Not Specified'}</span></p>

                                            <p className="flex justify-between">Upcoming Exam/Test Date: <span>{accommodation.dateTime ? new Date(accommodation.dateTime).toDateString() : 'Not Specified'}</span></p>

                                            <p className="flex justify-between">Previous Accommodations: <span>{accommodation.previousAccommodation || 'Not Specified'}</span></p>

                                            <p className="flex justify-between">Supporting Documentation: <span>{accommodation.supportingDocumentation || 'Not Specified'}</span></p>

                                            <div className="flex justify-between">
                                                Document(s):
                                                <div>
                                                    {accommodation.document.length > 0 ? accommodation.document.map(document => {
                                                        return (<p key={document}>
                                                            <Link target="_blank" to={document} className="text-blue-600 underline">{cleanFileName(decodeURIComponent(document))}</Link>
                                                        </p>)
                                                    }) : 'Not Attached'}
                                                </div>
                                            </div>

                                            <p className="flex justify-between">Total Price: <span className="font-semibold text-xl text-black">${Math.round(accommodation.price)}</span></p>
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

export default CheckOutAccommodationSuccess;