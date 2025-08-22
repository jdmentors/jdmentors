import { forwardRef, useId, useState } from "react";
import { FileSignature } from "lucide-react";

const FileInput = forwardRef(function FileInput(
    { onChange, multiple = true, accept, ...props },
    ref
) {
    const inputId = useId();
    const [files, setFiles] = useState([]);

    const handleChange = (e) => {
        const selected = Array.from(e.target.files || []);
        setFiles(selected);
        onChange?.(e);
    };

    return (
        <div className="max-w-full w-full p-6 bg-white rounded-lg border border-gray-500/30 shadow-[0px_1px_15px_0px] shadow-black/10 text-sm my-3">
            {/* Click/Drop target */}
            <label
                htmlFor={inputId}
                className="border-2 border-dotted border-gray-400 p-8 mt-2 flex flex-col justify-center items-center gap-4 cursor-pointer hover:border-blue-500 transition"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    const dropped = Array.from(e.dataTransfer.files || []);
                    if (dropped.length) {
                        setFiles(dropped);
                        // Optionally inform parent:
                        onChange?.({ target: { files: dropped } });
                    }
                }}
            >
                <FileSignature size={32} className="text-blue-600" />
                <p className="text-gray-500">
                    <span className="text-blue-600 underline">Click here</span> to upload (img, pdf, docx, etc.)
                </p>
            </label>

            {/* Hide input the safe way (not display:none) */}
            <input
                id={inputId}
                ref={ref}
                type="file"
                className="sr-only"
                multiple={multiple}
                accept={accept}
                onChange={handleChange}
                {...props}
            />

            {files.length > 0 && (
                <div className="mt-4 text-gray-700 text-sm">
                    <p className="font-medium">Selected files:</p>
                    <ul className="list-disc list-inside">
                        {files.map((f, i) => (
                            <li key={i}>{f.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mt-6 grid">
                <label
                    htmlFor={inputId}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white rounded cursor-pointer text-center"
                >
                    Upload File
                </label>
            </div>
        </div>
    );
});

export default FileInput;
