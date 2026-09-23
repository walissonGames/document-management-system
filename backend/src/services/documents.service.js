const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const repository = require('../repositories/documents.repository');

const storageDirectory = path.join(__dirname, '..', '..', 'storage');

function ensureStorageDirectory() {
  fs.mkdirSync(storageDirectory, { recursive: true });
}

function createStoredName(fileName, mimeType) {
  const extension = path.extname(fileName) || '';
  const id = crypto.randomUUID();
  return {
    id,
    storedName: `${id}${extension}`,
  };
}

function registerDocument(file, ownerId) {
  if (!file) {
    const error = new Error('Arquivo nao informado.');
    error.statusCode = 400;
    throw error;
  }

  ensureStorageDirectory();
  const generated = createStoredName(file.originalname, file.mimetype);
  const document = {
    id: generated.id,
    originalName: file.originalname,
    storedName: generated.storedName,
    mimeType: file.mimetype,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    ownerId: ownerId || 'default',
    filePath: path.join(storageDirectory, generated.storedName),
  };

  return repository.addDocument(document);
}

function getDocuments() {
  return repository.listDocuments();
}

function downloadDocument(id) {
  const document = repository.findDocumentById(id);

  if (!document) {
    const error = new Error('Documento nao encontrado.');
    error.statusCode = 404;
    throw error;
  }

  return document;
}

module.exports = {
  registerDocument,
  getDocuments,
  downloadDocument,
  storageDirectory,
};
