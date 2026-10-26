import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

export function crudRouter(Model, options = {}) {
  const router = Router();
  const scopedFilter = async (req, id) => ({ _id: id, ...(options.query ? await options.query(req) : {}) });
  router.get("/", asyncHandler(async (req, res) => {
    const query = options.query ? await options.query(req) : {};
    const items = await Model.find(query).sort({ createdAt: -1 }).limit(500);
    res.json({ data: items });
  }));
  router.get("/:id", asyncHandler(async (req, res) => {
    const item = await Model.findOne(await scopedFilter(req, req.params.id));
    if (!item) return res.status(404).json({ message: "Record not found" });
    res.json({ data: item });
  }));
  const canWrite = (req, res, next) => {
    if (options.writeRoles && !options.writeRoles.includes(req.user.role)) return res.status(403).json({ message: "Insufficient permissions" });
    next();
  };
  router.post("/", canWrite, asyncHandler(async (req, res) => {
    const item = await Model.create(options.beforeCreate ? options.beforeCreate(req.body, req) : req.body);
    if (options.afterCreate) await options.afterCreate(item, req);
    res.status(201).json({ data: item });
  }));
  router.patch("/:id", canWrite, asyncHandler(async (req, res) => {
    const item = await Model.findOneAndUpdate(await scopedFilter(req, req.params.id), req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: "Record not found" });
    if (options.afterUpdate) await options.afterUpdate(item, req);
    res.json({ data: item });
  }));
  router.delete("/:id", canWrite, asyncHandler(async (req, res) => {
    const item = await Model.findOneAndDelete(await scopedFilter(req, req.params.id));
    if (!item) return res.status(404).json({ message: "Record not found" });
    if (options.afterDelete) await options.afterDelete(item, req);
    res.json({ message: "Record deleted" });
  }));
  return router;
}
