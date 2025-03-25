export interface User {
  id: string;
  email: string;
  username: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  gender: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface OTPData {
  verificationId: string;
  otp: string;
  isOtp: true;
}

export interface ResetPasswordData {
  verificationId: string;
  otp: string;
  newPassword: string;
  isOtp: true;
}
export interface VerifyOTPResponse {
  message?: string;
 
}
