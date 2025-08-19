import { Phone, Shield, Video } from "lucide-react";
import { useNavigate } from "react-router";

function CallToAction(){
    const navigate = useNavigate();
    return (
        <section className="max-w-full bg-gray-900 text-white border-b border-b-gray-800">
            <div className="flex flex-col items-center justify-center text-center py-10 px-2 ">  
                <div className="flex items-center justify-center bg-white px-3 py-1.5 shadow gap-1 rounded-full text-xs">
                    <Shield size={18} className="text-blue-950" />
                    <span className="text-blue-950">
                        Trusted by Law Applicants
                    </span>
                </div>
                <h2 className="text-2xl md:text-4xl font-medium my-3">
                   Your Law School Journey Starts Here
                    <br />
                    — Make Your Application Stand Out
                </h2>
                <p className="text-gray-400 mt-2 max-w-5xl max-md:text-sm">
                    Book a consultation and get clear strategies to strengthen your application. From essays to resumes, we’ll highlight what makes you a strong candidate.
                </p>
                
                <div className="flex gap-3 flex-wrap items-center justify-center my-4">
                    <button onClick={() => navigate('/services')} type="button" className="inline-flex items-center justify-center gap-1 text-white whitespace-nowrap rounded-md font-medium h-12 px-8 bg-blue-600 hover:bg-blue-700 cursor-pointer"> 
                    Book Consultation

                    <Video strokeWidth={1.5} />
                    </button>
                </div>

                <p className="text-gray-400 mt-2 max-w-5xl max-md:text-sm">
                    Expert Advice • Ask Anything Freely • Fast Response Guaranteed
                </p>
            </div>
        </section>
    );
}

export default CallToAction;