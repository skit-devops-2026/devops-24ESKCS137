import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import { config } from "../config/env.js";
import { authenticate } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const sign = (user) => jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
const serialize = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone });

router.post("/register", asyncHandler(async (req, res) => {
  const { name, email, password, role = "manager", phone } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Name, email, and password are required" });
  if (password.length < 8) return res.status(400).json({ message: "Password must contain at least 8 characters" });
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email is already registered" });
  const user = await User.create({ name, email, phone, role: ["admin", "owner", "manager", "accountant", "tenant"].includes(role) ? role : "manager", passwordHash: await bcrypt.hash(password, 12) });
  res.status(201).json({ token: sign(user), user: serialize(user) });
}));

router.post("/login", asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select("+passwordHash");
  if (!user || !(await bcrypt.compare(req.body.password || "", user.passwordHash))) return res.status(401).json({ message: "Invalid email or password" });
  res.json({ token: sign(user), user: serialize(user) });
}));

router.get("/me", authenticate, (req, res) => res.json({ user: serialize(req.user) }));
router.post("/logout", authenticate, (req, res) => res.json({ message: "Logged out" }));
export default router;
