const documentsService = require('../services/documents.service');

function uploadDocument(req, res, next) {
  try {
    const document = documentsService.registerDocument(req.file, req.body.ownerId);
    res.status(201).json(document);
  } catch (error) {
    next(error);
  }
}

function listDocuments(req, res, next) {
  try {
    res.json(documentsService.getDocuments(req.query.ownerId));
  } catch (error) {
    next(error);
  }
}

function downloadDocument(req, res, next) {
  try {
    const document = documentsService.downloadDocument(req.params.id, req.query.ownerId);
    res.download(document.filePath, document.downloadName);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadDocument,
  listDocuments,
  downloadDocument,
};
