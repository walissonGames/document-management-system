const express = require('express');
const multer = require('multer');
const documentsRoutes = require('./routes/documents.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.use('/', documentsRoutes);
app.use((err, req, res, next) => {
  if (err && err instanceof multer.MulterError) {
    res.status(400).json({ message: err.message });
    return;
  }

  const statusCode = err && err.statusCode ? err.statusCode : 500;
  res.status(statusCode).json({
    message: err && err.message ? err.message : 'Erro interno do servidor.',
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`DMS backend ouvindo na porta ${PORT}`);
  });
}

module.exports = app;
