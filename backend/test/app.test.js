const fs = require('fs');
const path = require('path');
const { test } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

const storageDirectory = path.join(__dirname, '..', 'storage');

function removeStorageArtifacts() {
  fs.rmSync(storageDirectory, { recursive: true, force: true });
}

function createDocumentFormData({ ownerId = 'user_1', content = 'conteudo importante', filename = 'contrato.txt', type = 'text/plain' } = {}) {
  const formData = new FormData();
  formData.append('ownerId', ownerId);
  formData.append('file', new Blob([content], { type }), filename);
  return formData;
}

function startServer() {
  return new Promise((resolve) => {
    const server = app.listen(0, '127.0.0.1', () => resolve(server));
  });
}

async function createTestContext(t) {
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

  return { baseUrl };
}

async function uploadDocument(baseUrl, options) {
  const response = await fetch(`${baseUrl}/upload`, {
    method: 'POST',
    body: createDocumentFormData(options),
  });

  return {
    response,
    body: await response.json(),
  };
}

// Teste de fumaça do seed: garante que o app Express foi exportado.
// Novos testes serão adicionados durante os Steps 2, 6 e 7 com auxílio do Copilot.
test('o app backend é exportado', () => {
  assert.ok(app, 'o app deve estar definido');
  assert.strictEqual(typeof app, 'function', 'o app Express deve ser uma função');
});

test('faz upload de documento com sucesso', async (t) => {
  const { baseUrl } = await createTestContext(t);
  const { response, body: uploadedDocument } = await uploadDocument(baseUrl);

  assert.strictEqual(response.status, 201);
  assert.strictEqual(uploadedDocument.ownerId, 'user_1');
  assert.strictEqual(uploadedDocument.originalName, 'contrato.txt');
  assert.strictEqual(uploadedDocument.mimeType, 'text/plain');
  assert.strictEqual(uploadedDocument.size, Buffer.byteLength('conteudo importante'));
  assert.match(uploadedDocument.id, /^[0-9a-f-]+\.txt$/i);
});

test('lista apenas os documentos do usuario informado', async (t) => {
  const { baseUrl } = await createTestContext(t);
  const { body: uploadedDocument } = await uploadDocument(baseUrl, {
    ownerId: 'user_1',
    filename: 'contrato.txt',
  });
  await uploadDocument(baseUrl, {
    ownerId: 'user_2',
    filename: 'laudo.txt',
    content: 'conteudo reservado',
  });

  const listResponse = await fetch(`${baseUrl}/documents?ownerId=user_1`);
  assert.strictEqual(listResponse.status, 200);
  const listedDocuments = await listResponse.json();
  assert.strictEqual(listedDocuments.length, 1);
  assert.strictEqual(listedDocuments[0].id, uploadedDocument.id);
  assert.strictEqual(listedDocuments[0].ownerId, 'user_1');
});

test('baixa um documento do proprio usuario', async (t) => {
  const { baseUrl } = await createTestContext(t);
  const { body: uploadedDocument } = await uploadDocument(baseUrl);

  const successfulDownloadResponse = await fetch(
    `${baseUrl}/documents/${uploadedDocument.id}/download?ownerId=user_1`,
  );
  assert.strictEqual(successfulDownloadResponse.status, 200);
  assert.match(
    successfulDownloadResponse.headers.get('content-disposition') || '',
    /contrato\.txt/i,
  );
  assert.strictEqual(await successfulDownloadResponse.text(), 'conteudo importante');
});

test('o backend restringe documentos por usuario e protege o download', async (t) => {
  const { baseUrl } = await createTestContext(t);
  const { body: uploadedDocument } = await uploadDocument(baseUrl);

  const forbiddenDownloadResponse = await fetch(
    `${baseUrl}/documents/${uploadedDocument.id}/download?ownerId=user_2`,
  );
  assert.strictEqual(forbiddenDownloadResponse.status, 403);

  const invalidIdResponse = await fetch(
    `${baseUrl}/documents/not-a-valid-id.txt/download?ownerId=user_1`,
  );
  assert.strictEqual(invalidIdResponse.status, 400);

  const missingOwnerResponse = await fetch(`${baseUrl}/documents`);
  assert.strictEqual(missingOwnerResponse.status, 400);
});

test('o backend rejeita tipos de arquivo nao permitidos', async (t) => {
  const { baseUrl } = await createTestContext(t);
  const response = await fetch(`${baseUrl}/upload`, {
    method: 'POST',
    body: createDocumentFormData({
      type: 'application/javascript',
      filename: 'payload.js',
      content: 'alert("xss")',
    }),
  });

  assert.strictEqual(response.status, 400);
  assert.deepStrictEqual(await response.json(), {
    message: 'Tipo de arquivo nao permitido.',
  });
});
