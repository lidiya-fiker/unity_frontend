"use client";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { AppDispatch } from "@/store/store";
import { SignupData } from "@/types/authTypes";
import { signup } from "@/store/authSlice";
import { useEffect, useState } from "react";
const API_URL = "http://localhost:3000";

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [role, setRole] = useState<"CLIENT" | "COUNSELOR" | null>(null);

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam) {
      setRole(roleParam as "CLIENT" | "COUNSELOR");
    }
  }, [searchParams]);

  const onSubmit = async (data: SignupData) => {
    if (!role) {
      setErrorMessage("Role is required");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await dispatch(signup({ ...data, role }));
      console.log(response);
      if (response.payload?.verificationId) {
        router.push(
          `/verify?verificationId=${response.payload.verificationId}`,
        );
      }
    } catch (error) {
      setErrorMessage("Signup failed, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Sign-Up Click
  const handleGoogleSignup = async () => {
    if (!role) {
      setErrorMessage("Role is required");
      return;
    }
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const redirectUrl = `${API_URL}/auth/google?role=${role}`;
      window.location.href = redirectUrl;
    } catch (error) {
      setErrorMessage("Google Sign-Up failed, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* First Name */}

        <div>
          <input
            {...register("firstName", { required: "First name is required" })}
            placeholder="First Name"
            className="border p-2 w-full"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <input
            {...register("lastName", { required: "Last name is required" })}
            placeholder="Last Name"
            className="border p-2 w-full"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: /^[^@ ]+@[^@ ]+\.[^@ ]+$/,
            })}
            placeholder="Email"
            className="border p-2 w-full"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            {...register("password", {
              required: "Password is required",
              minLength: 6,
            })}
            type="password"
            placeholder="Password"
            className="border p-2 w-full"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">
              {errors.password.message ||
                "Password must be at least 6 characters"}
            </p>
          )}
        </div>

        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white p-2 rounded">
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>

        <div className="mt-4">
          <br />
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full bg-red-500 text-white p-2 rounded flex items-center justify-center gap-2">
            {isLoading ? "Redirecting..." : "Sign up with Google"}
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.1 0 5.8 1.1 7.9 2.9l5.9-5.9C33.5 2.5 29.1 0 24 0 14.6 0 6.8 5.8 3.4 14.2l7.1 5.5C12.7 13.4 17.9 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.1 24.5c0-1.5-.1-3-.4-4.5H24v9h12.5c-.5 2.6-2.1 4.8-4.4 6.2l6.9 5.4c4-3.7 6.3-9.2 6.3-15.1z"
              />
              <path
                fill="#FBBC05"
                d="M10.5 28.1c-1.1-3.2-1.1-6.6 0-9.8l-7.1-5.5C.9 17.4 0 20.6 0 24c0 3.4.9 6.6 2.4 9.3l7.1-5.2z"
              />
              <path
                fill="#34A853"
                d="M24 48c5.1 0 9.5-1.7 12.6-4.7l-6.9-5.4c-1.9 1.3-4.3 2-6.9 2-6.1 0-11.3-3.9-13.2-9.3l-7.1 5.2C6.8 42.2 14.6 48 24 48z"
              />
            </svg>
          </button>
        </div>
      </form>
    </>
  );
}
