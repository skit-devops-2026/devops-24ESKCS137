import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { Property, Unit, Tenant, Lease, Invoice, Payment, Utility, Maintenance } from "../models/index.js";
import { crudRouter } from "./crud.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
router.use(authenticate);
const writeRoles = ["admin", "owner", "manager", "accountant"];
const writable = { writeRoles };
const ownedProperties = async (req) => req.user.role === "admin" ? null : Property.find({ owner: req.user._id }).distinct("_id");
const propertyQuery = async (req) => {
  const ids = await ownedProperties(req);
  return ids ? { owner: req.user._id } : {};
};
const unitQuery = async (req) => {
  const ids = await ownedProperties(req);
  return ids ? { property: { $in: ids } } : {};
};
const leaseQuery = async (req) => {
  const ids = await ownedProperties(req);
  if (!ids) return {};
  const units = await Unit.find({ property: { $in: ids } }).distinct("_id");
  return { unit: { $in: units } };
};
const tenantQuery = async (req) => {
  const leases = await leaseQuery(req);
  if (!leases.unit) return {};
  const tenantIds = await Lease.find(leases).distinct("tenant");
  return { _id: { $in: tenantIds } };
};
const invoiceQuery = async (req) => {
  const leases = await leaseQuery(req);
  if (!leases.unit) return {};
  const leaseIds = await Lease.find(leases).distinct("_id");
  return { lease: { $in: leaseIds } };
};
const paymentQuery = async (req) => {
  const invoices = await invoiceQuery(req);
  if (!invoices.lease) return {};
  const invoiceIds = await Invoice.find(invoices).distinct("_id");
  return { invoice: { $in: invoiceIds } };
};
const utilityQuery = async (req) => {
  const ids = await ownedProperties(req);
  if (!ids) return {};
  const unitIds = await Unit.find({ property: { $in: ids } }).distinct("_id");
  return { unit: { $in: unitIds } };
};
const maintenanceQuery = async (req) => {
  const ids = await ownedProperties(req);
  return ids ? { property: { $in: ids } } : {};
};
const syncInvoice = async (invoiceId) => {
  const [invoice, totals] = await Promise.all([
    Invoice.findById(invoiceId),
    Payment.aggregate([{ $match: { invoice: invoiceId } }, { $group: { _id: null, paid: { $sum: "$amount" } } }])
  ]);
  if (!invoice) return;
  const paidAmount = totals[0]?.paid || 0;
  invoice.paidAmount = paidAmount;
  invoice.status = paidAmount >= invoice.amount ? "paid" : paidAmount > 0 ? "partial" : "sent";
  await invoice.save();
};
router.use("/properties", crudRouter(Property, { ...writable, query: propertyQuery, beforeCreate: (body, req) => ({ ...body, owner: req.user._id }) }));
router.use("/units", crudRouter(Unit, { ...writable, query: unitQuery }));
router.use("/tenants", crudRouter(Tenant, { ...writable, query: tenantQuery }));
router.use("/leases", crudRouter(Lease, { ...writable, query: leaseQuery }));
router.use("/invoices", crudRouter(Invoice, { ...writable, query: invoiceQuery }));
router.use("/payments", crudRouter(Payment, { ...writable, query: paymentQuery, afterCreate: (item) => syncInvoice(item.invoice), afterUpdate: (item) => syncInvoice(item.invoice), afterDelete: (item) => syncInvoice(item.invoice) }));
router.use("/utilities", crudRouter(Utility, { ...writable, query: utilityQuery }));
router.use("/maintenance", crudRouter(Maintenance, { ...writable, query: maintenanceQuery }));
router.use("/reports", authorize(...writeRoles), Router().get("/summary", asyncHandler(async (req, res) => {
  const [properties, units, tenants, activeLeases, invoices, payments, openMaintenance] = await Promise.all([
    Property.countDocuments(), Unit.countDocuments(), Tenant.countDocuments(), Lease.countDocuments({ status: "active" }),
    Invoice.aggregate([{ $group: { _id: null, billed: { $sum: "$amount" }, paid: { $sum: "$paidAmount" } } }]),
    Payment.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
    Maintenance.countDocuments({ status: { $in: ["open", "in_progress"] } })
  ]);
  const totals = invoices[0] || { billed: 0, paid: 0 };
  res.json({ data: { properties, units, tenants, activeLeases, occupiedUnits: await Unit.countDocuments({ status: "occupied" }), collection: totals.paid, outstanding: Math.max(0, totals.billed - totals.paid), payments: payments[0]?.total || 0, openMaintenance } });
})));
router.get("/dashboard", asyncHandler(async (req, res) => {
  const [recentInvoices, recentMaintenance] = await Promise.all([
    Invoice.find().sort({ createdAt: -1 }).limit(5).populate("tenant unit", "name unitNumber"),
    Maintenance.find().sort({ createdAt: -1 }).limit(5).populate("property unit", "name unitNumber")
  ]);
  const [properties, units, tenants, activeLeases, invoiceTotals, openMaintenance] = await Promise.all([
    Property.countDocuments(), Unit.countDocuments(), Tenant.countDocuments(), Lease.countDocuments({ status: "active" }),
    Invoice.aggregate([{ $group: { _id: null, billed: { $sum: "$amount" }, paid: { $sum: "$paidAmount" } } }]),
    Maintenance.countDocuments({ status: { $in: ["open", "in_progress"] } })
  ]);
  const totals = invoiceTotals[0] || { billed: 0, paid: 0 };
  res.json({ data: { kpis: { properties, units, tenants, activeLeases, occupiedUnits: await Unit.countDocuments({ status: "occupied" }), collection: totals.paid, outstanding: Math.max(0, totals.billed - totals.paid), openMaintenance }, recentInvoices, recentMaintenance } });
}));
router.post("/automations/run", authorize(...writeRoles), asyncHandler(async (req, res) => {
  const overdue = await Invoice.updateMany({ dueDate: { $lt: new Date() }, status: { $in: ["sent", "partial"] }, $expr: { $lt: ["$paidAmount", "$amount"] } }, { $set: { status: "overdue" } });
  const occupied = await Lease.find({ status: "active" }).select("unit");
  const occupiedIds = occupied.map((lease) => lease.unit);
  const occupancy = await Unit.updateMany({ _id: { $in: occupiedIds } }, { $set: { status: "occupied" } });
  const available = await Unit.updateMany({ _id: { $nin: occupiedIds }, status: "occupied" }, { $set: { status: "available" } });
  res.json({ data: { overdueInvoices: overdue.modifiedCount, occupiedUnits: occupancy.modifiedCount, availableUnits: available.modifiedCount } });
}));
export default router;
