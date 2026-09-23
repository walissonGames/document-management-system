const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const repository = require('../repositories/documents.repository');

const storageDirectory = path.join(__dirname, '..', '..', 'storage');
const maxFileSizeInBytes = 10 * 1024 * 1024;
const ownerIdPattern = /^[a-zA-Z0-9_-]{3,50}$/;
const storedNamePattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[a-z0-9]{1,10}$/i;
const allowedFileTypes = Object.freeze({
  '.pdf': ['application/pdf'],
  '.txt': ['text/plain'],
  '.png': ['image/png'],
  '.jpg': ['image/jpeg'],
  '.jpeg': ['image/jpeg'],
  '.doc': ['application/msword'],
  '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
});

function createValidationError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function ensureStorageDirectory() {
  fs.mkdirSync(storageDirectory, { recursive: true });
}

function normalizeOwnerId(ownerId) {
  const normalizedOwnerId = String(ownerId || '').trim();

  if (!normalizedOwnerId) {
    throw createValidationError('Informe um usuario para acessar os documentos.');
  }

  if (!ownerIdPattern.test(normalizedOwnerId)) {
    throw createValidationError('O usuario informado e invalido.');
  }

  return normalizedOwnerId;
}

function resolveAllowedExtension(originalName, mimeType) {
  const extension = path.extname(originalName || '').toLowerCase();
  const allowedMimeTypes = allowedFileTypes[extension];

  if (!extension || !allowedMimeTypes || !allowedMimeTypes.includes(mimeType)) {
    throw createValidationError('Tipo de arquivo nao permitido.');
  }

  return extension;
}

function createStoredFilename(file) {
  const extension = resolveAllowedExtension(file.originalname, file.mimetype);
  return `${crypto.randomUUID()}${extension}`;
}

function validateUploadFile(file) {
  if (!file) {
    throw createValidationError('Arquivo nao informado.');
  }

  resolveAllowedExtension(file.originalname, file.mimetype);

  if (!Number.isFinite(file.size) || file.size <= 0) {
    throw createValidationError('O arquivo enviado esta vazio.');
  }

  if (file.size > maxFileSizeInBytes) {
    throw createValidationError('O arquivo excede o tamanho maximo permitido.');
  }
}

function sanitizeOriginalName(originalName) {
  const baseName = path.basename(originalName || 'documento');
  const sanitizedName = baseName.replace(/[^a-zA-Z0-9._() -]/g, '_').trim();
  return sanitizedName || 'documento';
}

function resolveStoredFilePath(storedName) {
  if (!storedNamePattern.test(storedName)) {
    throw createValidationError('Identificador de documento invalido.');
  }

  const resolvedPath = path.resolve(storageDirectory, storedName);
  const relativePath = path.relative(storageDirectory, resolvedPath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    throw createValidationError('Identificador de documento invalido.');
  }

  return resolvedPath;
}

function registerDocument(file, ownerId) {
  validateUploadFile(file);
  ensureStorageDirectory();

  const normalizedOwnerId = normalizeOwnerId(ownerId);
  const filePath = resolveStoredFilePath(file.filename);
  const document = {
    id: file.filename,
    originalName: sanitizeOriginalName(file.originalname),
    storedName: file.filename,
    mimeType: file.mimetype,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    ownerId: normalizedOwnerId,
  };

  if (!fs.existsSync(filePath)) {
    throw createValidationError('Arquivo enviado nao foi salvo corretamente.', 500);
  }

  return repository.addDocument(document);
}

function getDocuments(ownerId) {
  const normalizedOwnerId = normalizeOwnerId(ownerId);
  return repository
    .listDocuments()
    .filter((document) => document.ownerId === normalizedOwnerId);
}

function downloadDocument(id, ownerId) {
  const normalizedOwnerId = normalizeOwnerId(ownerId);
  resolveStoredFilePath(id);

  const document = repository.findDocumentById(id);

  if (!document) {
    throw createValidationError('Documento nao encontrado.', 404);
  }

  if (document.ownerId !== normalizedOwnerId) {
    throw createValidationError('Voce nao pode baixar este documento.', 403);
  }

  const filePath = resolveStoredFilePath(document.storedName);

  if (!fs.existsSync(filePath)) {
    throw createValidationError('Arquivo do documento nao encontrado.', 404);
  }

  return {
    ...document,
    filePath,
    downloadName: sanitizeOriginalName(document.originalName),
  };
}

module.exports = {
  createStoredFilename,
  downloadDocument,
  ensureStorageDirectory,
  getDocuments,
  maxFileSizeInBytes,
  registerDocument,
  resolveAllowedExtension,
  storageDirectory,
  validateUploadFile,
};
