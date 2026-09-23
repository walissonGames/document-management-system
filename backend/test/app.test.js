const fs = require('fs');
const path = require('path');
const { test } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

const storageDirectory = path.join(__dirname, '..', 'storage');

function removeStorageArtifacts() {
  fs.rmSync(storageDirectory, { recursive: true, force: true });
}

function startServer() {
  return new Promise((resolve) => {
    const server = app.listen(0, '127.0.0.1', () => resolve(server));
  });
}

// Teste de fumaça do seed: garante que o app Express foi exportado.
// Novos testes serão adicionados durante os Steps 2, 6 e 7 com auxílio do Copilot.
test('o app backend é exportado', () => {
  assert.ok(app, 'o app deve estar definido');
  assert.strictEqual(typeof app, 'function', 'o app Express deve ser uma função');
});

test('o backend restringe documentos por usuario e protege o download', async (t) => {
  removeStorageArtifacts();

  const server = await startServer();
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  t.after(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
    removeStorageArtifacts();
  });

  const formData = new FormData();
  formData.append('ownerId', 'user_1');
  formData.append('file', new Blob(['conteudo importante'], { type: 'text/plain' }), 'contrato.txt');

  const uploadResponse = await fetch(`${baseUrl}/upload`, {
    method: 'POST',
    body: formData,
  });

  assert.strictEqual(uploadResponse.status, 201);
  const uploadedDocument = await uploadResponse.json();
  assert.strictEqual(uploadedDocument.ownerId, 'user_1');
  assert.match(uploadedDocument.id, /^[0-9a-f-]+\.txt$/i);

  const listResponse = await fetch(`${baseUrl}/documents?ownerId=user_1`);
  assert.strictEqual(listResponse.status, 200);
  const listedDocuments = await listResponse.json();
  assert.strictEqual(listedDocuments.length, 1);
  assert.strictEqual(listedDocuments[0].id, uploadedDocument.id);

  const forbiddenDownloadResponse = await fetch(
    `${baseUrl}/documents/${uploadedDocument.id}/download?ownerId=user_2`,
  );
  assert.strictEqual(forbiddenDownloadResponse.status, 403);

  const invalidIdResponse = await fetch(
    `${baseUrl}/documents/not-a-valid-id.txt/download?ownerId=user_1`,
  );
  assert.strictEqual(invalidIdResponse.status, 400);

  const successfulDownloadResponse = await fetch(
    `${baseUrl}/documents/${uploadedDocument.id}/download?ownerId=user_1`,
  );
  assert.strictEqual(successfulDownloadResponse.status, 200);
  assert.match(
    successfulDownloadResponse.headers.get('content-disposition') || '',
    /contrato\.txt/i,
  );
  assert.strictEqual(await successfulDownloadResponse.text(), 'conteudo importante');

  const missingOwnerResponse = await fetch(`${baseUrl}/documents`);
  assert.strictEqual(missingOwnerResponse.status, 400);
});

test('o backend rejeita tipos de arquivo nao permitidos', async (t) => {
  removeStorageArtifacts();

  const server = await startServer();
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  t.after(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
    removeStorageArtifacts();
  });

  const formData = new FormData();
  formData.append('ownerId', 'user_1');
  formData.append(
    'file',
    new Blob(['alert(\"xss\")'], { type: 'application/javascript' }),
    'payload.js',
  );

  const response = await fetch(`${baseUrl}/upload`, {
    method: 'POST',
    body: formData,
  });

  assert.strictEqual(response.status, 400);
  assert.deepStrictEqual(await response.json(), {
    message: 'Tipo de arquivo nao permitido.',
  });
});
