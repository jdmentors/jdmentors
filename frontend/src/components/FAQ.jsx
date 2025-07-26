import { Minus, Plus } from "lucide-react";
import { useState } from "react";

function FAQ({question, answer}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="px-4 py-5 sm:px-6 border-b border-b-blue-100">
            <div onClick={() => setIsOpen(!isOpen)} className="flex items-start justify-between w-full text-left cursor-pointer">
                <span className="text-lg font-medium text-blue-950">{question}</span>
                <span className="ml-6 flex-shrink-0">
                    {
                        isOpen ?
                        <Minus className="text-blue-600" /> :
                        <Plus className="text-blue-600" />
                    }
                </span>
            </div>
            <div className={`mt-2 ${isOpen ? 'block' : 'hidden'}`}>
                <p className="text-gray-600">{answer}</p>
            </div>
        </div>
    );
}

export default FAQ;