# Especificação - Document Management System

## 1. Objetivo

Entregar um sistema web para envio, listagem e download de documentos com armazenamento local e gestão simples por usuário.

## 2. Escopo

### Dentro do escopo

- Upload de documentos
- Listagem de documentos
- Download de documentos
- Associação simples de cada documento a um usuário
- Armazenamento local dos arquivos no filesystem da aplicação

### Fora do escopo

- Armazenamento em nuvem ou provedor externo
- Versionamento de documentos
- Compartilhamento avançado entre usuários
- Edição do conteúdo dos arquivos
- Processamento assíncrono de arquivos

## 3. Requisitos funcionais

| ID | Requisito |
| --- | --- |
| RF-01 | O sistema deve permitir o upload de um documento por requisição HTTP multipart/form-data. |
| RF-02 | O sistema deve registrar os metadados do documento enviado. |
| RF-03 | O sistema deve listar os documentos enviados. |
| RF-04 | O sistema deve permitir o download de um documento pelo identificador. |
| RF-05 | O sistema deve associar cada documento a um usuário dono. |
| RF-06 | O sistema deve expor uma interface de consumo simples para o frontend via prefixo `/api`. |
| RF-07 | O sistema deve manter o fluxo de responsabilidades separado entre rotas, controllers, services e repositories. |

## 4. Requisitos não funcionais

| ID | Requisito |
| --- | --- |
| RNF-01 | Os arquivos enviados devem ser gravados no filesystem local da aplicação. |
| RNF-02 | O upload deve usar `multer` com `diskStorage`. |
| RNF-03 | Os metadados dos documentos devem permanecer em memória nesta fase inicial. |
| RNF-04 | A configuração deve seguir o padrão 12-Factor, com variáveis de ambiente. |
| RNF-05 | O backend deve ser implementado em Node.js com Express e CommonJS. |
| RNF-06 | O frontend deve ser implementado em React com Vite e consumir o backend via `fetch`. |
| RNF-07 | O código deve seguir Clean Architecture simples e evitar acoplamento entre camadas. |

## 5. Modelo de dados

### Entidade: Document

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| id | string | sim | Identificador único do documento. |
| originalName | string | sim | Nome original do arquivo enviado. |
| storedName | string | sim | Nome salvo no filesystem local. |
| mimeType | string | sim | Tipo MIME do arquivo. |
| size | number | sim | Tamanho do arquivo em bytes. |
| uploadedAt | string | sim | Data e hora do upload em ISO 8601. |
| ownerId | string | sim | Identificador do usuário dono do documento. |
| filePath | string | sim | Caminho local do arquivo salvo. |

### Observações de persistência

- Os metadados ficam em memória nesta fase.
- O arquivo físico fica em `backend/storage`.
- O identificador do documento deve ser suficiente para buscar os metadados e recuperar o arquivo no download.

## 6. Contratos de API

### 6.1 POST `/api/upload`

**Descrição:** envia um documento para o sistema.

**Entrada**

- Content-Type: `multipart/form-data`
- Campo do arquivo: `file`
- Campo opcional do usuário: `ownerId`

**Resposta de sucesso**

```json
{
  "id": "doc_123",
  "originalName": "contrato.pdf",
  "storedName": "doc_123.pdf",
  "mimeType": "application/pdf",
  "size": 12345,
  "uploadedAt": "2026-09-23T13:05:50.000Z",
  "ownerId": "user_1"
}
```

**Códigos**

- `201 Created`
- `400 Bad Request`
- `415 Unsupported Media Type`

### 6.2 GET `/api/documents`

**Descrição:** lista os documentos enviados.

**Resposta de sucesso**

```json
[
  {
    "id": "doc_123",
    "originalName": "contrato.pdf",
    "storedName": "doc_123.pdf",
    "mimeType": "application/pdf",
    "size": 12345,
    "uploadedAt": "2026-09-23T13:05:50.000Z",
    "ownerId": "user_1"
  }
]
```

**Códigos**

- `200 OK`

### 6.3 GET `/api/documents/:id/download`

**Descrição:** baixa o arquivo associado ao identificador informado.

**Resposta de sucesso**

- Conteúdo binário do arquivo
- Headers devem indicar o `Content-Type` e permitir download do arquivo original

**Códigos**

- `200 OK`
- `404 Not Found`

## 7. Decisões arquiteturais

- O backend seguirá Clean Architecture simples com `routes -> controllers -> services -> repositories`.
- As rotas tratam apenas mapeamento HTTP e delegam para controllers.
- Controllers fazem validação básica e adaptação de request/response.
- Services concentram as regras de negócio de upload, listagem e download.
- Repositories encapsulam o acesso aos metadados em memória e a leitura dos arquivos gravados localmente.
- O armazenamento físico será estritamente local, sem serviços externos.
- O frontend consumirá a API por `fetch` usando o prefixo `/api`.

## 8. Plano de execução

1. Definir a estrutura das camadas do backend e os contratos internos entre controller, service e repository.
2. Implementar o modelo de metadados em memória e a lógica de identificação dos documentos.
3. Implementar o fluxo de upload com `multer` e `diskStorage`, salvando arquivos em `backend/storage`.
4. Implementar os endpoints de listagem e download com tratamento básico de erros.
5. Criar a integração do frontend com os contratos da API usando o prefixo `/api`.
6. Validar o comportamento esperado com testes direcionados e ajustes finais de consistência.
