import mongoose from "mongoose";

const { Schema } = mongoose;
const ref = (model) => ({ type: Schema.Types.ObjectId, ref: model, required: true });

const userSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ["admin", "owner", "manager", "accountant", "tenant"], default: "manager", index: true },
  phone: { type: String, trim: true }
}, { timestamps: true });

const propertySchema = new Schema({
  owner: ref("User"),
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  description: String
}, { timestamps: true });
propertySchema.index({ owner: 1, name: 1 });

const unitSchema = new Schema({
  property: ref("Property"),
  unitNumber: { type: String, required: true, trim: true },
  type: { type: String, enum: ["room", "studio", "1bhk", "2bhk", "3bhk", "commercial"], default: "room" },
  rent: { type: Number, required: true, min: 0 },
  deposit: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ["available", "occupied", "maintenance"], default: "available", index: true },
  amenities: [String]
}, { timestamps: true });
unitSchema.index({ property: 1, unitNumber: 1 }, { unique: true });

const tenantSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  identityNumber: { type: String, trim: true },
  emergencyContact: String,
  status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });
tenantSchema.index({ email: 1 });

const leaseSchema = new Schema({
  unit: ref("Unit"),
  tenant: ref("Tenant"),
  startDate: { type: Date, required: true },
  endDate: Date,
  monthlyRent: { type: Number, required: true, min: 0 },
  deposit: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ["draft", "active", "ended", "overdue"], default: "active", index: true },
  dueDay: { type: Number, min: 1, max: 28, default: 5 }
}, { timestamps: true });
leaseSchema.index({ unit: 1, status: 1 });

const invoiceSchema = new Schema({
  lease: ref("Lease"),
  tenant: ref("Tenant"),
  unit: ref("Unit"),
  period: { type: String, required: true },
  dueDate: { type: Date, required: true },
  amount: { type: Number, required: true, min: 0 },
  paidAmount: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ["draft", "sent", "partial", "paid", "overdue"], default: "sent", index: true },
  notes: String
}, { timestamps: true });
invoiceSchema.index({ lease: 1, period: 1 }, { unique: true });

const paymentSchema = new Schema({
  invoice: ref("Invoice"),
  tenant: ref("Tenant"),
  amount: { type: Number, required: true, min: 0 },
  paidAt: { type: Date, default: Date.now },
  method: { type: String, enum: ["cash", "bank_transfer", "upi", "card", "other"], default: "bank_transfer" },
  reference: String,
  notes: String
}, { timestamps: true });

const utilitySchema = new Schema({
  unit: ref("Unit"),
  tenant: { type: Schema.Types.ObjectId, ref: "Tenant" },
  readingDate: { type: Date, required: true },
  previousReading: { type: Number, default: 0, min: 0 },
  currentReading: { type: Number, required: true, min: 0 },
  rate: { type: Number, required: true, min: 0 },
  amount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["pending", "billed", "paid"], default: "pending" }
}, { timestamps: true });

const maintenanceSchema = new Schema({
  property: ref("Property"),
  unit: { type: Schema.Types.ObjectId, ref: "Unit" },
  tenant: { type: Schema.Types.ObjectId, ref: "Tenant" },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
  status: { type: String, enum: ["open", "in_progress", "resolved", "cancelled"], default: "open", index: true },
  cost: { type: Number, default: 0, min: 0 },
  assignedTo: String
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const Property = mongoose.models.Property || mongoose.model("Property", propertySchema);
export const Unit = mongoose.models.Unit || mongoose.model("Unit", unitSchema);
export const Tenant = mongoose.models.Tenant || mongoose.model("Tenant", tenantSchema);
export const Lease = mongoose.models.Lease || mongoose.model("Lease", leaseSchema);
export const Invoice = mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);
export const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
export const Utility = mongoose.models.Utility || mongoose.model("Utility", utilitySchema);
export const Maintenance = mongoose.models.Maintenance || mongoose.model("Maintenance", maintenanceSchema);
