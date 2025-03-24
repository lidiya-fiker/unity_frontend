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

      const { access_token, refresh_token } = response.data;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      setSuccess(true);

      setTimeout(() => router.push("/login"), 1000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Something went wrong during verification.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {success ? (
        <div>
          <p>Your account has been successfully verified!</p>
          <button onClick={() => router.push("/login")}>Go to Login</button>
        </div>
      ) : (
        <div>
          <p>Please enter the OTP sent to your email:</p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={loading}
          />
          <button onClick={handleVerify} disabled={loading || !otp.trim()}>
            {loading ? "Verifying..." : "Verify"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default VerifyAccountPage;
