import { resend } from "@/lib/resend";

import  EmailVerification  from "../../emails/verificationEmail";
import {ApiResponse } from "@/types/apiResponse";


export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
await resend.emails.send({
    from:"onboarding@resend.dev",
    to: email,
    subject: " Fun Messages | Verification Code",
    react: EmailVerification({ username, otp: verifyCode }),
  });

    return {
      success: true,
      message: "Verification email sent successfully.",
    };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return {
      success: false,
      message: "Failed to send verification email.",
    };
  }
}