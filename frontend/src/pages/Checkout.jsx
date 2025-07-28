import { CalendarDays, Check, File, LockKeyholeIcon, Mail, Phone, User, UserCheck2 } from "lucide-react";
import { Container, FileInput } from "../components";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRef } from "react";

const service =
{
    title: 'Personal Statement Review',
    description: 'Comprehensive 1-on-1 sessions to refine your personal statement, ensuring it effectively communicates your unique story and qualifications.',
    offers: ['Structural and content analysis', 'Grammar and style improvements', 'Strategic positioning for non-T14 schools'],
    price: 100,
    process: 'Submit your draft, Independent review, and 1-hour video consultation to refine your statement.'
};

function Checkout() {
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            fullName:'',
            email:'',
            phone:'',
            dateTime:'',
            document:'',
        }
    });

    const formRef = useRef();

    const checkoutHandler = async (userData) => {
        try {
            console.log(userData);
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    }

    return (
        <section className="min-h-[70vh] mt-24 md:mt-32">
            <Container className="grid md:grid-cols-2 gap-5 lg:gap-14 xl:gap-20 divide-blue-100">
                {/* Customer Information */}
                <section>
                    <h2 className="text-3xl font-bold text-blue-950">Checkout</h2>

                    <div className="my-8">
                        <h5 className="font-semibold text-blue-950">Customer Information</h5>
                        <form ref={formRef} onSubmit={handleSubmit(checkoutHandler)} className="border border-blue-100 p-5 rounded-md my-5 shadow-lg shadow-blue-100">
                            <div className="grid md:grid-cols-2 md:gap-3">
                                <div className="text-gray-600 grid grid-cols-1 my-2 md:my-3">
                                    <label className="flex items-center gap-1 text-sm" htmlFor='fullName'><User size={18} /> <span>Full Name *</span></label>
                                    <input id="fullName" type="text" placeholder="e.g. Alan Parker" className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" {...register('fullName', { required: true })} />
                                </div>

                                <div className="text-gray-600 grid grid-cols-1 my-2 md:my-3">
                                    <label className="flex items-center gap-1 text-sm" htmlFor='email'><Mail size={18} /> <span>E-Mail *</span></label>
                                    <input id="email" type="email" placeholder="name@example.com" className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" {...register('email', { required: true })} />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 md:gap-3">
                                <div className="text-gray-600 grid grid-cols-1 my-2 md:my-3">
                                    <label className="flex items-center gap-1 text-sm" htmlFor='phone'><Phone size={18} /> <span>Phone</span></label>
                                    <input id="phone" type="tel" placeholder="+1 9985XXXX" className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" {...register('phone', { required: false })} />
                                </div>

                                <div className="text-gray-600 grid grid-cols-1 my-2 md:my-3">
                                    <label className="flex items-center gap-1 text-sm" htmlFor='dateTime'><CalendarDays size={18} /> <span>Preferred Date & Time</span></label>
                                    <input id="dateTime" type="datetime-local" className="text-black border-2 border-blue-100 py-1.5 px-2 rounded my-1 focus-within:outline-2 focus-within:outline-blue-200" {...register('dateTime', { required: false })} />
                                </div>
                            </div>

                            <div className="text-gray-600 grid grid-cols-1 my-2 md:my-3">
                                <label className="flex items-center gap-1 text-sm"><File size={18} /> <span>Document to be reviewed *</span></label>

                                <FileInput {...register('document', {required:true})} />
                            </div>
                        </form>
                    </div>
                </section>

                {/* Review Order */}
                <section>
                    <h5 className="font-semibold text-blue-950 md:mt-16">Review Your Order</h5>

                    <div className="bg-blue-50 border border-blue-100 p-5 rounded-md mb-8 mt-5 md:sticky md:top-20 shadow-lg shadow-blue-100">
                        <div className="flex items-center mb-4">
                            <div className="bg-blue-100 p-2.5 rounded-full mr-4 w-10 h-10 flex items-center justify-center">
                                <UserCheck2 className="text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-blue-950">{service.title}</h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                            {service.description}
                        </p>
                        <ul className="text-gray-600 space-y-2">
                            {
                                service.offers.map(offer => (
                                    <li key={offer} className="flex items-start gap-1">
                                        <Check className="text-blue-600" size={18} />
                                        <span>{offer}</span>
                                    </li>
                                ))
                            }
                        </ul>

                        <div className="mt-5 text-gray-600">
                            <p className="flex justify-between">Total Price: <span className="font-semibold text-xl text-black">${service.price}</span></p>

                            <button onClick={() => formRef.current.requestSubmit()} type="button" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white rounded cursor-pointer w-full my-5">
                                Book Now
                            </button>

                            <div className="text-sm text-gray-500">
                                <p className="flex items-center gap-1 text-sm font-semibold text-black mb-1.5"><LockKeyholeIcon size={18} strokeWidth={1.5} /> Secured Checkout - SSL Encrypted</p>

                                <p>Enusring your financial and personal details are secure during every transaction.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </Container>
        </section>
    );
}

export default Checkout;