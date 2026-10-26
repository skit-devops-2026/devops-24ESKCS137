import dotenv from "dotenv";

dotenv.config();

const required = (name, fallback) => process.env[name] || fallback;

export const config = {
  port: Number(required("PORT", "3000")),
  mongoUri: required("MONGODB_URI", "mongodb://127.0.0.1:27017/rental360"),
  jwtSecret: required("JWT_SECRET", "development-only-change-me"),
  jwtExpiresIn: required("JWT_EXPIRES_IN", "1d"),
  clientUrl: required("CLIENT_URL", "http://localhost:5173"),
  gitSha: process.env.GIT_SHA || process.env.RENDER_GIT_COMMIT || "local"
};
