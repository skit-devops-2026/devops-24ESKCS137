import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { User } from "../models/index.js";

export async function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Authentication required" });
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = await User.findById(payload.id).select("-passwordHash");
    if (!req.user) return res.status(401).json({ message: "User no longer exists" });
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Insufficient permissions" });
  next();
};
