import { X } from "lucide-react";
import { useEffect } from "react";
import { lazy, Suspense } from "react";
import LoadingSpinner from "./LoadingSpinner";

const AllLSATPackages = lazy(() => import('./AllLSATPackages'));

function LSATPackagesModal({ isOpen, onClose }) {
    // Close modal on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Close modal when clicking on backdrop
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden relative">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-blue-950">
                            LSAT Tutoring Packages
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                    <div className="p-6 mb-6">
                        <Suspense fallback={
                            <div className="flex justify-center items-center py-20">
                                <LoadingSpinner />
                            </div>
                        }>
                            <AllLSATPackages />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LSATPackagesModal;