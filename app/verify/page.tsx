"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const VerifyAccountPage = () => {
  const [loading, setLoading] = useState(false); // Set loading to false initially
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otp, setOtp] = useState(""); // State to store OTP input
  const router = useRouter();

  const handleVerify = async () => {
    setLoading(true); // Start loading when verifying
    setError(null); // Clear any previous errors
    
    try {
      // Get the verification token (verificationId) from the URL query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const verificationId = urlParams.get("verificationId");

      if (!verificationId) {
        setError("Verification ID is missing.");
        setLoading(false);
        return;
      }

      if (!otp) {
        setError("OTP is required for verification.");
        setLoading(false);
        return;
      }

      // Make the request to verify the account with the necessary body
      const response = await axios.post(
        "http://localhost:3000/client/verifyAccount",
        {
          verificationId,
          otp,
          isOtp: true, // Assuming the verification requires OTP
        },
      );

      if (response.status === 200) {
        const { access_token, refresh_token } = response.data;

        // Save the tokens in localStorage or cookies
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        setSuccess(true);

        // Redirect to login after a short delay
        setTimeout(() => {
          router.push("/login");
        }, 1000); // Delay the redirect slightly to show success message
      } else {
        setError("Account verification faild");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Something went wrong during verification.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = () => {
    router.push("/login");
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value); // Update OTP input
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => router.push("/login")}>Go to Login</button>
      </div>
    );
  }

  if (success) {
    return (
      <div>
        <p>Your account has been successfully verified!</p>
        <button onClick={() => router.push("/login")}>Go to Login</button>
      </div>
    );
  }

  return (
    <div>
      <p>Please enter the OTP sent to your email:</p>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={handleOtpChange}
      />
      <button onClick={handleVerify}>Verify</button>
    </div>
  );
};

export default VerifyAccountPage;
