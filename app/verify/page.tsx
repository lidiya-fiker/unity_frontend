"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OTPData, OTPDataResend } from "@/types/authTypes";
import { ResendOTP, verifyOTP } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";
import { AppDispatch } from "@/store/store";

export default function VerifyAccount() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit } = useForm<{ otp: string }>();

  const [verificationId, setVerificationId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get("verificationId");
    if (id) setVerificationId(id);
  }, [searchParams]);

  const onSubmit = async (data: { otp: string }) => {
    if (!verificationId) {
      setErrorMessage("verification ID is missing");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const otpData: OTPData = {
      verificationId,
      otp: data.otp,
      isOtp: true,
    };

    try {
      const response = await dispatch(verifyOTP(otpData)).unwrap();
      console.log(response);

      if (response) {
        setSuccessMessage("Account verified successfully!");
        router.push("/login");
      } else {
        setErrorMessage("OTP verification failed.");
      }
    } catch (error) {
      setErrorMessage("OTP verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    if (!verificationId) {
      setErrorMessage("Verification ID is missing");
      return;
    }

    const resendData: OTPDataResend = { verificationId };

    try {
      setIsLoading(true);
      const response = await dispatch(ResendOTP(resendData));
      console.log("Resend Response:", response);
      console.log("New Verification ID:", response.payload?.verificationId);
      if (response.payload?.verificationId) {
        // Redirect to the verify page with the verificationId
        router.replace(
          `/verify?verificationId=${response.payload.verificationId}`,
        );
      }
    } catch (error) {
      setErrorMessage("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Verify Your Account</h2>
        {errorMessage && (
          <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-green-500 text-sm mb-2">{successMessage}</p>
        )}

        <input
          {...register("otp", { required: true })}
          placeholder="Enter OTP"
          className="w-full p-2 border rounded mb-2"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white w-full p-2 rounded"
          disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          type="button"
          onClick={resendOTP}
          className="mt-2 bg-gray-500 text-white w-full p-2 rounded"
          disabled={isLoading}>
          {isLoading ? "Resending..." : "Resend OTP"}
        </button>
      </form>
    </div>
  );
}
