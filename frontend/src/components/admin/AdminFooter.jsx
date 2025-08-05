import { Link } from "react-router";

function AdminFooter(){
    return (
        <footer className="w-full flex justify-center bg-gray-900 text-white p-5 gap-5">
            <p>&copy; {new Date().getFullYear()} JDMentors</p>
            <Link to="/" className="underline">Visit Website</Link>
        </footer>
    );
}

export default AdminFooter;