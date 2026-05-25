// last-resort error handler — Express calls this when next(err) is triggered
function errorHandler(err, req, res, _next) {
  console.error(`[${req.method}] ${req.path} →`, err.message);

  const status  = err.status ?? err.statusCode ?? 500;
  const message = status < 500 ? err.message : 'Internal server error.';

  res.status(status).json({ message });
}

module.exports = errorHandler;