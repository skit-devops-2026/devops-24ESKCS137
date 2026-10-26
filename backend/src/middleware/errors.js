export function notFound(req, res) {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  const status = error.name === "ValidationError" ? 400 : error.code === 11000 ? 409 : error.status || 500;
  const message = status === 500 ? "Internal server error" : error.message;
  if (status === 500) console.error(error);
  res.status(status).json({ message, ...(error.errors && { errors: Object.values(error.errors).map((item) => item.message) }) });
}
