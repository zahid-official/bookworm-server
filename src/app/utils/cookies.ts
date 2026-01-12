import { Response } from "express";
import envVars from "../config/env";

// Interface AuthTokens
interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

// Common cookie options
type SameSite = "lax" | "none";
const sameSiteOption: SameSite =
  envVars.NODE_ENV === "production" ? "none" : "lax";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: sameSiteOption,
};

// Set tokens in cookies
const setCookies = (res: Response, tokenInfo: AuthTokens) => {
  // Set access token in cookies
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, cookieOptions);
  }

  // Set refresh token in cookies
  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, cookieOptions);
  }
};

// Clear tokens from cookies
const clearCookies = (res: Response) => {
  // Clear access token
  res.clearCookie("accessToken", cookieOptions);

  // Clear refresh token
  res.clearCookie("refreshToken", cookieOptions);
};

export { setCookies, clearCookies };
