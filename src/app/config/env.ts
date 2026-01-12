import "dotenv/config";
import EnvConfig from "../interfaces/env.interface";

const loadEnvs = (): EnvConfig => {
  // Check missing envs
  const requiredEnvs: string[] = [
    "DB_URL",
    "PORT",
    "NODE_ENV",
    "FRONTEND_URL",

    "DEFAULT_ADMIN_EMAIL",
    "DEFAULT_ADMIN_PASSWORD",

    "EXPRESS_SESSION_SECRET",
    "BCRYPT_SALT_ROUNDS",

    "JWT_ACCESS_SECRET",
    "JWT_ACCESS_EXPIRESIN",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRESIN",

    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];

  // Check missing envs
  requiredEnvs.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing the required enviroment variable : ${key}`);
    }
  });

  // Number validation helper
  const assertNumber = (value: string, field: string): number => {
    const num = Number(value);
    if (isNaN(num)) {
      throw new Error(`Environment variable ${field} must be a valid number`);
    }
    return num;
  };

  // Return validated envs
  return {
    DB_URL: process.env.DB_URL as string,
    PORT: assertNumber(process.env.PORT as string, "PORT"),
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    FRONTEND_URL: process.env.FRONTEND_URL as string,

    DEFAULT_ADMIN_EMAIL: process.env.DEFAULT_ADMIN_EMAIL as string,
    DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD as string,

    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    BCRYPT_SALT_ROUNDS: assertNumber(
      process.env.BCRYPT_SALT_ROUNDS as string,
      "BCRYPT_SALT_ROUNDS"
    ),

    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_ACCESS_EXPIRESIN: process.env.JWT_ACCESS_EXPIRESIN as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRESIN: process.env.JWT_REFRESH_EXPIRESIN as string,

    CLOUDINARY: {
      CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
      API_KEY: process.env.CLOUDINARY_API_KEY as string,
      API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
    },
  };
};

// Export envVars;
const envVars = loadEnvs();
export default envVars;
