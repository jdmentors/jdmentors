import { Check, CheckCircle2, FileDownIcon, Plus, Search, UserCheck2 } from "lucide-react";
import Container from "../components/Container";
import { Link, useParams } from "react-router";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { LoadingSpinner } from "../components";
import cleanFileName from "../hooks/CleanFileName";
import { useForm } from "react-hook-form";

function SessionStatus() {
    const [session, setSession] = useState(null);
    const [checking, setChecking] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            id: ''
        }
    });

    const checkStatusHandler = async (sessionData) => {
        try {
            setChecking(true);
            const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/sessions/single/${sessionData.id}`);

            if (data && data.success) {
                setSession(data.data);
                reset();
                setChecking(false);
            }
        } catch (error) {
            console.error(error);
            setChecking(false);
        }
    }
    
    return (
        <section className="my-32">
            <Container>
                <div className="flex justify-center items-center flex-col gap-2 w-full sm:max-w-xl sm:mx-auto sm:text-center">
                    <CheckCircle2 size={60} className="text-green-600 mb-4" />
                    <h2 className="text-3xl font-bold text-blue-950 text-center">
                        Check Session Status
                    </h2>
                    <p className="text-gray-600 mb-8 text-center">
                        Please put your session ID below to check the status.
                    </p>

                    <form className="w-full flex flex-col items-center justify-center gap-2" onSubmit={handleSubmit(checkStatusHandler)}>
                        <div className="flex items-center border-2 pl-4 gap-2 bg-white border-blue-100 focus-within:outline-2 focus-within:outline-blue-200 h-[46px] rounded-full overflow-hidden max-w-md w-full">
                            <Search className="text-gray-600" />
                            <input type="text" placeholder="Session ID" className="w-full h-full outline-none text-sm text-gray-500" {...register('id', { required: true })} />
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 w-32 h-9 rounded-full text-sm text-white mr-[5px] cursor-pointer">{checking ? 'Checking...' : 'Check'}</button>
                        </div>
                        {errors.id && <p className="text-sm text-orange-500">Session ID is required!</p>}
                    </form>
                    {
                        session
                            ?
                            (
                                <section>
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
                                        
                                        {
                                            session.service.features && session.service.features.length > 0 &&
                                            <>
                                                <p className="text-gray-600 my-3 font-semibold text-left">Features:</p>
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
                                            session.addonsAndExtras && session.addonsAndExtras.length > 0 &&
                                            <>
                                                <p className="text-gray-600 my-3 font-semibold text-left">Add-ons & Extras:</p>
                                                <ul className="text-gray-600 space-y-2">
                                                    {
                                                        session.addonsAndExtras.map(addonAndExtra => (
                                                            <li key={addonAndExtra} className="flex items-start gap-1">
                                                                <Plus className="text-blue-600" size={18} />
                                                                <span>{addonAndExtra}</span>
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            </>
                                        }

                                        <div className="mt-5 text-gray-600 flex flex-col gap-3">
                                            <div className="flex justify-between">Status: <p className={`flex items-center gap-1 ${session.status ? 'text-green-600' : 'text-red-600'}`}><span className={`h-2 w-2 ${session.status ? 'bg-green-600' : 'bg-red-600'} rounded-full`}></span> <span>{session.status ? 'Done' : 'Pending'}</span></p></div>

                                            <p className="flex justify-between">Preferred Time: <span>{new Date(session.dateTime).toDateString()}</span></p>

                                            <div className="flex gap-2">
                                                <p className="text-gray-800">Doc(s):</p>
                                                <div>
                                                    {
                                                        session.document.map((doc) => {
                                                            return (
                                                                <Link key={doc} target="_blank" to={`${doc}`} className="flex gap-1 items-center"><FileDownIcon size={18} /> <span className="text-blue-600 hover:underline">{cleanFileName(decodeURIComponent(doc))}</span></Link>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>

                                            <div className="flex justify-between">Payment: <p className={`flex items-center gap-1 ${session.payment ? 'text-green-600' : 'text-red-600'}`}><span className={`h-2 w-2 ${session.payment ? 'bg-green-600' : 'bg-red-600'} rounded-full`}></span> <span>{session.payment ? 'Done' : 'Pending'}</span></p></div>

                                            <p className="flex justify-between">Total Price: <span className="font-semibold text-xl text-black">${session.price}</span></p>
                                        </div>
                                    </div>
                                </section>
                            )
                            :
                            // <LoadingSpinner />
                            <div className="mb-5"></div>
                    }

                    <Link to={`/`} className="border-2 border-blue-100 rounded-md py-2 px-5">Back To Home</Link>
                </div>
            </Container>
        </section>
    );
}

export default SessionStatus;