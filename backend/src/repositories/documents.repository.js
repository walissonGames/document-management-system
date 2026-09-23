const documents = [];

function addDocument(document) {
  documents.push(document);
  return document;
}

function listDocuments() {
  return documents.slice();
}

function findDocumentById(id) {
  return documents.find((document) => document.id === id) || null;
}

module.exports = {
  addDocument,
  listDocuments,
  findDocumentById,
};
