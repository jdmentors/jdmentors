// components/LSATPackageSuccess.jsx
import { Container } from "../components";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Check, Calendar, Users, Mail } from "lucide-react";
import { Link } from "react-router";

function LSATPackageSuccess() {
  const { purchaseId } = useParams();
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchaseDetails = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-packages/purchase/${purchaseId}`
        );

        if (data && data.success) {
          setPurchase(data.data);
        }
      } catch (error) {
        console.error('Error fetching purchase details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseDetails();
  }, [purchaseId]);

  if (loading) {
    return (
      <Container className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">Loading your purchase details...</div>
      </Container>
    );
  }

  if (!purchase) {
    return (
      <Container className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center text-red-600">
          Unable to load purchase details. Please contact support.
        </div>
      </Container>
    );
  }

  return (
    <Container className="min-h-[70vh] pt-32 pb-16">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="text-green-600" size={40} />
        </div>

        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>

        <p className="text-xl text-gray-700 mb-8">
          Thank you for purchasing the {purchase.package.title}
        </p>

        {/* Purchase Details */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            Purchase Details
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Users className="text-blue-600" size={20} />
              <div>
                <span className="font-semibold">Sessions: </span>
                {purchase.sessionsPurchased} LSAT tutoring sessions
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="text-blue-600" size={20} />
              <div>
                <span className="font-semibold">Remaining: </span>
                {purchase.sessionsRemaining} sessions available
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="text-blue-600" size={20} />
              <div>
                <span className="font-semibold">Valid until: </span>
                {new Date(purchase.expiresAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="text-blue-600" size={20} />
              <div>
                <span className="font-semibold">Email: </span>
                {purchase.userEmail}
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What's Next?
          </h3>
          <ul className="space-y-2 text-gray-700 text-left">
            {/* <li>• You will receive a confirmation email shortly</li> */}
            <li>• Use your email to book sessions with our LSAT tutors</li>
            <li>• Your package is valid for {purchase.package.duration}</li>
            <li>• Sessions are automatically deducted from your balance</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/lsat-tutoring"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Book Your First Session
          </Link>
          <Link
            to="/user/dashboard"
            className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </Container>
  );
}

export default LSATPackageSuccess;