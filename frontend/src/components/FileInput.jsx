import { FileSignature } from "lucide-react";
import { forwardRef } from "react";

function FileInput({...props}, ref){
    return (
        <div className="max-w-full w-full p-6 bg-white rounded-lg border border-gray-500/30 shadow-[0px_1px_15px_0px] shadow-black/10 text-sm my-3">
            <label htmlFor="fileInput" className="border-2 border-dotted border-gray-400 p-8 mt-2 flex flex-col justify-center items-center gap-4 cursor-pointer hover:border-blue-500 transition">
                <FileSignature size={32} className="text-blue-600" />
                <p className="text-gray-500">Drag files or <span className="text-blue-600 underline">click here</span> here to upload</p>
                <input ref={ref} id="fileInput" type="file" className="mx-auto w-42" {...props} />
            </label>
        
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
                <button type="button" className="px-9 py-2 border border-gray-500/50 bg-white hover:bg-blue-100/30 active:scale-95 transition-all text-gray-500 rounded">
                    Cancel
                </button>
                <label htmlFor="fileInput" type="button" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white rounded cursor-pointer text-center">
                    Upload File
                </label>
            </div>
        </div>
    );
};

export default forwardRef(FileInput);