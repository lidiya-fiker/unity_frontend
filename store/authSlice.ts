"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  AuthState,
  SignupData,
  LoginData,
  OTPData,
  ResetPasswordData,
  OTPDataResend,
  ForgetPasswordData,
} from "../types/authTypes";

const API_URL = "http://localhost:3000"; // Replace with your backend URL

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

// Async Thunks for API Calls
export const signup = createAsyncThunk(
  "client/signup",
  async (userData: SignupData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/client/signup`, // Corrected endpoint
        userData,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Signup failed");
    }
  },
);

export const login = createAsyncThunk(
  "client/signin",
  async (userData: LoginData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/client/signin`, userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  },
);

export const verifyOTP = createAsyncThunk(
  "client/verifyAccount",
  async (otpData: OTPData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/client/verifyAccount`,
        otpData,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "OTP Verification failed");
    }
  },
);

export const ResendOTP = createAsyncThunk(
  "client/resend-otp",
  async (verificationId: OTPDataResend, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/client/resend-otp`,
        verificationId,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "resend otp failed");
    }
  },
);

export const ForgetPassword = createAsyncThunk(
  "client/forget-password",
  async (forgetPassword: ForgetPasswordData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/client/forget-password`,
        forgetPassword,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "resend otp failed");
    }
  },
);

export const resetPassword = createAsyncThunk(
  "client/reset-password",
  async (resetData: ResetPasswordData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/client/reset-password`,
        resetData,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Reset Password failed");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signup.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.access_token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
