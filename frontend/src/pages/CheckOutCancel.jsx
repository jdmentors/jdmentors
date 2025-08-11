import { CheckCircle2, CircleX } from "lucide-react";
import Container from "../components/Container";
import { Link, useParams } from "react-router";

function CheckOutCancel() {
    const { serviceId } = useParams();
    console.log(serviceId);
    // 68947d32a075cda58999c64c
    return (
        <section className="my-32">
            <Container>
                <div className="flex justify-center items-center flex-col gap-4 w-full sm:max-w-xl sm:mx-auto sm:text-center">
                    <CircleX size={60} className="text-red-500 mb-2" />
                    <h2 className="text-3xl font-bold text-blue-950">
                        Your Booking Has Failed
                    </h2>
                    <p className="text-blue-950">
                        We could not process your order due to some technical issues during payment. Please try again. We'll reach out to you soon. Keep checking your mail.
                    </p>
                    <Link to={`/`} className="border-2 border-blue-100 rounded-md py-2 px-5">Back To Home</Link>
                </div>
            </Container>
        </section>
    );
}

export default CheckOutCancel;