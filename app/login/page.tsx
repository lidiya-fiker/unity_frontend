"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "../lib/axios";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  useEffect(() => {
    // Check if the access token is available in localStorage
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      // Automatically log the user in by setting the token in the request headers
      axios.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
      // Redirect the user to a protected page or home page
      router.push("/home"); // Change this to wherever the user should be redirected
    }
  }, [router]);

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post("client/login", data);

      // Assuming the response contains the tokens
      const { access_token, refresh_token } = response.data;
      // Save tokens in localStorage or cookies
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      // Set authorization header for future requests
      axios.defaults.headers["Authorization"] = `Bearer ${access_token}`;

      // Redirect to home page or another protected page
      router.push("/home"); // Change this to the appropriate page
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
      </form>
    </div>
  );
}
