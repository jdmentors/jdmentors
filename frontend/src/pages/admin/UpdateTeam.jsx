import { AdminSidebar, AdminContainer, TeamForm } from "../../components";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

function UpdateTeam() {
    const { id } = useParams();
    const [member, setMember] = useState(null);

    useEffect(() => {
        const getTeamMember = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/team/single/${id}`);

                if (data && data.success) {
                    setMember(data.data);
                }
            } catch (error) {
                console.error(error);
            }
        }
        getTeamMember();
    }, [member])

    return (
        <section className="flex min-h-[90vh]">
            <AdminSidebar />

            <AdminContainer>
                <section className="my-auto">

                    <div className="max-w-full">
                        <h2 className="text-3xl md:text-4xl font-bold mb-5 text-blue-950">Update Team Member</h2>
                        <p className="text-gray-600">Keep your team's information accurate and present a unified front. Any changes here will be reflected on your public-facing About Us page.</p>
                    </div>

                    {member && <TeamForm member={member} />}
                </section>
            </AdminContainer>
        </section>
    );
}

export default UpdateTeam;