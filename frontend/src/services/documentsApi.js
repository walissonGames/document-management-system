const API_PREFIX = '/api';

async function handleResponse(response) {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || 'Erro ao comunicar com a API.');
  }

  return response.json();
}

function buildOwnerScopedUrl(path, ownerId) {
  const normalizedOwnerId = String(ownerId || '').trim();

  if (!normalizedOwnerId) {
    throw new Error('Informe um usuario para continuar.');
  }

  const queryString = new URLSearchParams({ ownerId: normalizedOwnerId }).toString();
  return `${API_PREFIX}${path}?${queryString}`;
}

export async function uploadDocument(file, ownerId) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('ownerId', String(ownerId || '').trim());

  const response = await fetch(`${API_PREFIX}/upload`, {
    method: 'POST',
    body: formData,
  });

  return handleResponse(response);
}

export async function listDocuments(ownerId) {
  const response = await fetch(buildOwnerScopedUrl('/documents', ownerId));
  return handleResponse(response);
}

export async function downloadDocument(id, ownerId, originalName) {
  const response = await fetch(
    buildOwnerScopedUrl(`/documents/${encodeURIComponent(id)}/download`, ownerId),
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || 'Erro ao baixar o documento.');
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = objectUrl;
  link.download = originalName;
  link.click();

  URL.revokeObjectURL(objectUrl);
}
