"use client";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/store/store";
import { SignupData } from "@/types/authTypes";
import { signup } from "@/store/authSlice";
import { useState } from "react";

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: SignupData) => {
    try {
      setIsLoading(true);
      setErrorMessage(null); // Reset previous error message
      const response = await dispatch(signup(data));
      console.log(response);
       if (response.payload?.verificationId) {
         // Redirect to the verify page with the verificationId
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

  return (
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

      {/* Username */}
      <div>
        <input
          {...register("username", { required: "Username is required" })}
          placeholder="Username"
          className="border p-2 w-full"
        />
        {errors.username && (
          <p className="text-red-500 text-sm">{errors.username.message}</p>
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

      {/* Gender */}
      <div>
        <select
          {...register("gender", { required: "Gender is required" })}
          className="border p-2 w-full">
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && (
          <p className="text-red-500 text-sm">{errors.gender.message}</p>
        )}
      </div>

      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 text-white p-2 rounded">
        {isLoading ? "Signing Up..." : "Sign Up"}
      </button>
    </form>
  );
}
