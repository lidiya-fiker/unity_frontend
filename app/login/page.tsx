"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "../lib/axios";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { login } from "@/store/authSlice";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = async (data: any) => {
    try {
      const response = await dispatch(login(data)).unwrap();

      // Assuming the response contains the tokens
      const { access_token, refresh_token } = response;
      // Save tokens in localStorage or cookies
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      // Set authorization header for future requests
      axios.defaults.headers["Authorization"] = `Bearer ${access_token}`;

      router.push("/home");
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          {...register("email")}
          placeholder="Email"
          className="w-full p-2 border rounded mb-2"
        />
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white w-full p-2 rounded">
          Login
        </button>
        <button
          onClick={() => signIn("google")}
          className="mt-2 bg-red-500 text-white w-full p-2 rounded">
          Login with Google
        </button>

        <p className="text-center mt-3">
          <a href="/forget-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </a>
        </p>
      </form>
    </div>
  );
}
