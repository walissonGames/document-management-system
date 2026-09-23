const API_PREFIX = '/api';

async function handleResponse(response) {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || 'Erro ao comunicar com a API.');
  }

  return response.json();
}

export async function uploadDocument(file, ownerId) {
  const formData = new FormData();
  formData.append('file', file);

  if (ownerId) {
    formData.append('ownerId', ownerId);
  }

  const response = await fetch(`${API_PREFIX}/upload`, {
    method: 'POST',
    body: formData,
  });

  return handleResponse(response);
}

export async function listDocuments() {
  const response = await fetch(`${API_PREFIX}/documents`);
  return handleResponse(response);
}

export function getDocumentDownloadUrl(id) {
  return `${API_PREFIX}/documents/${id}/download`;
}
