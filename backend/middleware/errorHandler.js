// last-resort error handler — Express calls this when next(err) is triggered
function errorHandler(err, req, res, _next) {
  console.error(`[${req.method}] ${req.path} →`, err.message);
  console.error(err.stack);

  const status = err.status ?? err.statusCode ?? 500;
  const dbAuthError = err.code === '28P01';
  const message = dbAuthError
    ? 'Erreur de connexion à la base de données : mot de passe PostgreSQL incorrect.'
    : status < 500
    ? err.message
    : 'Internal server error.';

  res.status(status).json({ message });
}

module.exports = errorHandler;