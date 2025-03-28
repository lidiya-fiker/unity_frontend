"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { ForgetPassword } from "@/store/authSlice";

export default function ForgetPasswordPage() {
  const { register, handleSubmit } = useForm<{ email: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: { email: string }) => {
    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await dispatch(ForgetPassword(data)).unwrap();
      if (response.verificationId) {
        setMessage("A password reset link has been sent to your email.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Failed to send OTP. Please check your email and try again.");
    } finally {
      setIsLoading(false);
    }
  };
 return (
   <div className="flex items-center justify-center min-h-screen bg-gray-100">
     <form
       onSubmit={handleSubmit(onSubmit)}
       className="bg-white p-6 rounded-lg shadow-md w-96">
       <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
       <input
         {...register("email")}
         placeholder="Enter your email"
         className="w-full p-2 border rounded mb-2"
       />
       <button
         type="submit"
         className="bg-blue-500 text-white w-full p-2 rounded">
         Send Reset Link
       </button>

       {message && <p className="text-center mt-3 text-green-500">{message}</p>}
     </form>
   </div>
 );
}
