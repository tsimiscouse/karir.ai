"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import ErrorModal from "@/components/Modal/ErrorModal";

interface SubmitStatus {
  success: boolean;
  message: string;
  userId?: string;
  emailVerified?: boolean;
}

export default function ResultPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
  });
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <LoadingSpinner size="large" showText={true} />
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://backend-services-express.victoriousdune-d492059e.southeastasia.azurecontainerapps.io/api/check-email-userid",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: "Email submitted successfully!",
          userId: data.id,
          emailVerified: data.emailStatus,
        });

        // Redirect to result/[id] page
        router.push(`/result/${data.id}`);
      } else {
        setErrorMessage(data.message || "User not found. Please check your email or try submitting your resume first.");
        setShowErrorModal(true);
        setSubmitStatus(null);
      }
    } catch {
      setErrorMessage("Error connecting to server. Please try again later.");
      setShowErrorModal(true);
      setSubmitStatus(null);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!submitStatus?.userId) return;

    setIsResendingVerification(true);

    try {
      // This is a placeholder - you would implement your actual resend verification logic here
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitStatus({
        ...submitStatus,
        message: "Verification email resent successfully!",
      });
    } catch {
      setSubmitStatus({
        ...submitStatus,
        success: false,
        message: "Failed to resend verification email. Please try again.",
      });
    } finally {
      setIsResendingVerification(false);
    }
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar />

      <main className="bg-white flex-grow min-h-screen md:pt-[40vh] pt-[37vh] pb-[27vh] md:pb-[40vh] px-[10vw] md:px-4">
        <section
          className="bg-gradient-to-br from-[#577C8E] to-[#3A5566] text-white p-6 md:p-8 lg:p-10 rounded-lg md:rounded-2xl shadow-xl w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[68vw] mx-auto"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <h2 className="text-xl md:text-2xl lg:text-3xl font-righteous font-bold text-center mb-6 md:mb-8">
            JOB MATCHING | CV SCORING
          </h2>

          {submitStatus && (
            <div
              className={`mb-4 md:mb-6 p-4 md:p-6 rounded-lg md:rounded-xl ${
                submitStatus.success
                  ? "bg-green-600 bg-opacity-30"
                  : "bg-red-600 bg-opacity-30"
              }`}
              data-aos="fade-in"
            >
              <div className="flex items-start">
                <div
                  className={`rounded-full p-1 ${
                    submitStatus.success ? "bg-green-500" : "bg-red-500"
                  } mr-2 md:mr-3 mt-1`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 md:h-5 md:w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    {submitStatus.success ? (
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    ) : (
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    )}
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm md:text-base">{submitStatus.message}</p>

                  {submitStatus.success &&
                    !submitStatus.emailVerified &&
                    submitStatus.userId && (
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={handleResendVerification}
                          disabled={isResendingVerification}
                          className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-base font-medium transition-all duration-200 flex items-center"
                        >
                          {isResendingVerification ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Sending...
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 md:h-5 md:w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                />
                              </svg>
                              Resend Verification Email
                            </>
                          )}
                        </button>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Left Column */}
            <div
              className="space-y-4 md:space-y-6 flex items-center justify-center"
              data-aos="fade-right"
              data-aos-delay="200"
              data-aos-duration="800"
            >
              <div className="w-full md:w-[90%]">
                <div className="flex items-center bg-[#FFFFFF15] border-2 border-[#FFFFFF30] backdrop-blur-sm rounded-lg md:rounded-xl px-4 md:px-5 py-3 md:py-4 focus-within:border-white transition-all duration-300 shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 md:h-6 md:w-6 text-gray-300 mr-3 md:mr-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    className="w-full bg-transparent focus:outline-none text-white placeholder-gray-300 font-sans text-sm md:text-base"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div
              className="flex items-center justify-center"
              data-aos="fade-left"
              data-aos-delay="400"
              data-aos-duration="800"
            >
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-[90%] bg-white text-[#3A5566] font-bold px-4 md:px-6 py-3 md:py-4 rounded-lg md:rounded-xl hover:bg-opacity-90 transition-all duration-300 shadow-lg flex items-center justify-center text-sm md:text-base"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 text-[#3A5566]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Submit
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 md:h-5 md:w-5 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 md:mt-8 text-center text-gray-300 text-sm md:text-base">
            Submit your email to check your job matching score
          </div>
        </section>
      </main>

      <ErrorModal
        isOpen={showErrorModal}
        onClose={handleCloseErrorModal}
        message={errorMessage}
      />

      <Footer />
    </div>
  );
}
