// components/LSATSessionSuccess.jsx
import { Container } from "../components";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Check, Calendar, Users, Mail, UserCheck2, Target, BookOpen, Clock, CheckCircle2, UserCircle } from "lucide-react";
import { Link } from "react-router";
import { LoadingSpinner } from "../components";
import cleanFileName from "../hooks/CleanFileName";

function LSATSessionSuccess() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-sessions/single/${sessionId}`
        );

        if (data && data.success) {
          setSession(data.data);

          // Send confirmation email if not already sent
          if (!data.data.emailSent) {
            try {
              const emailData = {
                fullName: data.data.fullName,
                email: data.data.email,
                phone: data.data.phone,
                sessionType: data.data.sessionType,
                currentScore: data.data.currentScore,
                targetScore: data.data.targetScore,
                weakAreas: data.data.weakAreas,
                studyMaterials: data.data.studyMaterials,
                previousTutoring: data.data.previousTutoring,
                specificGoals: data.data.specificGoals,
                dateTime: data.data.dateTime,
                notes: data.data.notes,
                numberOfStudents: data.data.numberOfStudents,
                price: data.data.price,
                pricePerPerson: data.data.pricePerPerson,
                document: data.data.document,
                sessionId: data.data._id,
                tutorName: data.data.tutor?.fullName,
                tutorEmail: data.data.tutor?.email, // ADD THIS LINE
                tutorSchool: data.data.tutor?.school
              };

              const { data: emailResponse } = await axios.post(
                `${import.meta.env.VITE_DOMAIN_URL}/api/v1/emails/lsat-session`,
                emailData
              );

              if (emailResponse && emailResponse.success) {
                await axios.patch(
                  `${import.meta.env.VITE_DOMAIN_URL}/api/v1/lsat-sessions/email-status/${sessionId}`,
                  { emailSent: true }
                );
              }
            } catch (error) {
              console.error('Error sending confirmation email:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching session details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  if (loading) {
    return (
      <Container className="min-h-[70vh] flex items-center justify-center pt-32">
        <LoadingSpinner />
      </Container>
    );
  }

  if (!session) {
    return (
      <Container className="min-h-[70vh] flex items-center justify-center pt-32">
        <div className="text-center text-red-600">
          Unable to load session details. Please contact support.
        </div>
      </Container>
    );
  }

  const getSessionTypeDisplay = (type) => {
    switch (type) {
      case 'free': return 'Free Consultation';
      case 'one-on-one': return '1-on-1 Tutoring';
      case 'class': return 'Group Class';
      default: return type;
    }
  };

  const getSessionDuration = (type) => {
    switch (type) {
      case 'free': return '30 minutes';
      case 'one-on-one': return '60 minutes';
      case 'class': return '60 minutes';
      default: return '';
    }
  };

  return (
    <section className="min-h-[70vh] pt-32 pb-16">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-green-600" size={40} />
          </div>

          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Session Booked Successfully!
          </h1>

          <p className="text-xl text-gray-700 mb-8">
            Your {getSessionTypeDisplay(session.sessionType).toLowerCase()} has been confirmed
          </p>

          {/* Session Details */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2.5 rounded-full mr-4 w-10 h-10 flex items-center justify-center">
                <UserCheck2 className="text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-blue-900">
                Session Details
              </h2>
            </div>

            <div className="space-y-4">
              {/* Tutor Information */}
              {session.tutor && (
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <UserCircle className="text-blue-600" size={18} />
                    Your Tutor
                  </h3>
                  <div className="flex items-center gap-4">
                    {session.tutor.image && (
                      <img
                        src={session.tutor.image}
                        alt={session.tutor.fullName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-lg text-blue-900">{session.tutor.fullName}</p>
                      <p className="text-gray-600">{session.tutor.school}</p>
                      <p className="text-sm text-gray-500 mt-1">{session.tutor.description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Session Type & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="text-blue-600" size={20} />
                  <div>
                    <span className="font-semibold">Session Type: </span>
                    {getSessionTypeDisplay(session.sessionType)}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="text-blue-600" size={20} />
                  <div>
                    <span className="font-semibold">Duration: </span>
                    {getSessionDuration(session.sessionType)}
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="flex items-center gap-3">
                <Calendar className="text-blue-600" size={20} />
                <div>
                  <span className="font-semibold">Scheduled for: </span>
                  {new Date(session.dateTime).toLocaleString()}
                </div>
              </div>

              {/* Group Size for Class Sessions */}
              {session.sessionType === 'class' && (
                <div className="flex items-center gap-3">
                  <Users className="text-blue-600" size={20} />
                  <div>
                    <span className="font-semibold">Group Size: </span>
                    {session.numberOfStudents} students
                  </div>
                </div>
              )}

              {/* Package Info for 1-on-1 Sessions */}
              {session.sessionType === 'one-on-one' && session.packagePurchaseId && (
                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <p className="font-semibold text-green-800">Package Session Used</p>
                  <p className="text-sm text-green-700">
                    {session.packagePurchaseId.sessionsRemaining} sessions remaining
                  </p>
                </div>
              )}

              {/* Contact Info */}
              <div className="flex items-center gap-3">
                <Mail className="text-blue-600" size={20} />
                <div>
                  <span className="font-semibold">Contact Email: </span>
                  {session.email}
                </div>
              </div>

              {/* LSAT Goals */}
              <div className="border-t border-blue-200 pt-4 mt-4">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Target className="text-blue-600" size={18} />
                  LSAT Goals
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Current Score: </span>
                    {session.currentScore || 'Not specified'}
                  </div>
                  <div>
                    <span className="font-medium">Target Score: </span>
                    {session.targetScore}
                  </div>
                </div>
                <div className="mt-2">
                  <span className="font-medium">Focus Areas: </span>
                  {session.weakAreas}
                </div>
              </div>

              {/* Documents */}
              {session.document && session.document.length > 0 && (
                <div className="border-t border-blue-200 pt-4 mt-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Uploaded Documents</h3>
                  <div className="space-y-1">
                    {session.document.map((doc, index) => (
                      <p key={index}>
                        <Link
                          target="_blank"
                          to={doc}
                          className="text-blue-600 underline text-sm"
                        >
                          {cleanFileName(decodeURIComponent(doc))}
                        </Link>
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Summary */}
              <div className="border-t border-blue-200 pt-4 mt-4">
                <h3 className="font-semibold text-blue-900 mb-2">Payment Summary</h3>
                <div className="flex justify-between items-center">
                  <span>Total Amount:</span>
                  <span className="font-bold text-xl text-black">
                    {session.sessionType === 'free'
                      ? 'Free'
                      : session.sessionType === 'one-on-one'
                        ? 'Package Session'
                        : `$${session.price}`
                    }
                  </span>
                </div>
                {session.sessionType === 'class' && session.pricePerPerson && (
                  <div className="text-sm text-gray-600 text-right">
                    (${session.pricePerPerson} per person)
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              What's Next?
            </h3>
            <ul className="space-y-2 text-gray-700 text-left">
              {session.sessionType === 'free' && (
                <>
                  <li>• You will receive a confirmation email with session details</li>
                  <li>• <strong>{session.tutor?.fullName}</strong> will contact you before your scheduled session</li>
                  <li>• Prepare any questions you have about your LSAT preparation</li>
                </>
              )}
              {session.sessionType === 'one-on-one' && (
                <>
                  <li>• Your package session has been reserved with <strong>{session.tutor?.fullName}</strong></li>
                  <li>• Your tutor will prepare customized materials for your session</li>
                  <li>• Bring your study materials and specific questions</li>
                  <li>• Sessions remaining: {session.packagePurchaseId?.sessionsRemaining}</li>
                </>
              )}
              {session.sessionType === 'class' && (
                <>
                  <li>• You will receive joining instructions via email</li>
                  <li>• Prepare to interact with other students in your group</li>
                  <li>• Have your study materials ready for the session</li>
                </>
              )}
              <li>• Join the session on time using the provided link</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/lsat-tutoring"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Book Another Session
            </Link>
            <Link
              to="/user/dashboard"
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/"
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default LSATSessionSuccess;