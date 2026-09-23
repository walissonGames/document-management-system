const fs = require('fs');
const path = require('path');

const storageDirectory = path.join(__dirname, '..', '..', 'storage');
const metadataFilePath = path.join(storageDirectory, 'documents.json');

function ensureMetadataFile() {
  fs.mkdirSync(storageDirectory, { recursive: true });

  if (!fs.existsSync(metadataFilePath)) {
    fs.writeFileSync(metadataFilePath, '[]', 'utf8');
  }
}

function readDocuments() {
  ensureMetadataFile();
  return JSON.parse(fs.readFileSync(metadataFilePath, 'utf8'));
}

function writeDocuments(documents) {
  ensureMetadataFile();
  fs.writeFileSync(metadataFilePath, JSON.stringify(documents, null, 2), 'utf8');
}

function addDocument(document) {
  const documents = readDocuments();
  documents.push(document);
  writeDocuments(documents);
  return document;
}

function listDocuments() {
  return readDocuments();
}

function findDocumentById(id) {
  const documents = readDocuments();
  return documents.find((document) => document.id === id) || null;
}

module.exports = {
  addDocument,
  listDocuments,
  findDocumentById,
};
