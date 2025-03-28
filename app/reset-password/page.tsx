"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "../lib/axios";
import { resetPassword } from "@/store/authSlice";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Extract token from URL

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  const onSubmit = async (data: any) => {
    if (!token) {
      setMessage("Invalid reset link. Please request a new one.");
      return;
    }

    try {
      await dispatch(resetPassword({ ...data, token })).unwrap();
      setMessage("Your password has been reset successfully.");
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      setMessage("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        <input
          {...register("newPassword")}
          type="password"
          placeholder="New Password"
          className="w-full p-2 border rounded mb-2"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white w-full p-2 rounded">
          Reset Password
        </button>

        {message && (
          <p className="text-center mt-3 text-green-500">{message}</p>
        )}
      </form>
    </div>
  );
}
