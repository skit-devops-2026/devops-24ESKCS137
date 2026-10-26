import bcrypt from "bcryptjs";
import { connectDatabase } from "../config/database.js";
import { User, Property, Unit, Tenant, Lease, Invoice } from "../models/index.js";

await connectDatabase();
const passwordHash = await bcrypt.hash("DemoPassword123!", 12);
const owner = await User.findOneAndUpdate(
  { email: "demo@rental360.local" },
  { name: "Demo Owner", email: "demo@rental360.local", passwordHash, role: "owner" },
  { upsert: true, new: true }
);
let property = await Property.findOne({ name: "Sunrise Residency", owner: owner._id });
if (!property) property = await Property.create({ owner: owner._id, name: "Sunrise Residency", address: "12 Lake Road", city: "Bengaluru" });
let unit = await Unit.findOne({ property: property._id, unitNumber: "A-101" });
if (!unit) unit = await Unit.create({ property: property._id, unitNumber: "A-101", type: "1bhk", rent: 18000, status: "occupied" });
let tenant = await Tenant.findOne({ email: "tenant@rental360.local" });
if (!tenant) tenant = await Tenant.create({ name: "Demo Tenant", email: "tenant@rental360.local", phone: "9000000000" });
let lease = await Lease.findOne({ unit: unit._id, tenant: tenant._id, status: "active" });
if (!lease) lease = await Lease.create({ unit: unit._id, tenant: tenant._id, monthlyRent: unit.rent, startDate: new Date(), status: "active" });
const period = new Date().toISOString().slice(0, 7);
await Invoice.updateOne({ lease: lease._id, period }, { $setOnInsert: { tenant: tenant._id, unit: unit._id, dueDate: new Date(), amount: lease.monthlyRent, status: "sent" } }, { upsert: true });
console.log("Demo data ready. Login: demo@rental360.local / DemoPassword123!");
process.exit(0);
