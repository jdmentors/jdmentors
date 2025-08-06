import { Trash } from "lucide-react";

function DeleteModalDialogue({popToHide, funcToRun}) {
    return (
        <div className="flex flex-col items-center bg-white shadow-md rounded-xl py-6 px-5 md:w-[460px] w-[370px] border border-gray-300">
            <div className="flex items-center justify-center p-4 bg-red-100 rounded-full">
                <Trash className="text-red-500 text-xl"  />
            </div>
            <h2 className="text-gray-900 font-semibold mt-4 text-xl">Are you sure?</h2>
            <p className="text-sm text-gray-600 mt-2 text-center">
                Do you really want to continue? This action<br />cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-4 mt-5 w-full">
                <button type="button" className="w-full md:w-36 h-10 rounded-md border border-gray-300 bg-white text-gray-600 font-medium text-sm hover:bg-gray-100 active:scale-95 transition cursor-pointer" onClick={() => popToHide(false)}>
                    Cancel
                </button>
                <button type="button" className="w-full md:w-36 h-10 rounded-md text-white bg-red-600 font-medium text-sm hover:bg-red-700 active:scale-95 transition cursor-pointer" onClick={() => funcToRun()}>
                    Confirm
                </button>
            </div>
        </div>
    );
}

export default DeleteModalDialogue;