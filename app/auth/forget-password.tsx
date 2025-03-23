import { useForm } from "react-hook-form";
import axios from "../lib/axios";
import { useState } from "react";

export default function ForgotPassword() {
  const { register, handleSubmit } = useForm();
  const [message, setMessage] = useState("");

  const onSubmit = async (data: any) => {
    try {
      await axios.post("/auth/forgot-password", data);
      setMessage("Check your email for reset instructions.");
    } catch (err: any) {
      setMessage("Something went wrong!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
        {message && <p>{message}</p>}
        <input
          {...register("email")}
          placeholder="Email"
          className="w-full p-2 border rounded mb-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white w-full p-2 rounded">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
