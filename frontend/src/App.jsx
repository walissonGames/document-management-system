import { useState } from 'react';
import DocumentList from './components/DocumentList';
import UploadComponent from './components/UploadComponent';
import { listDocuments } from './services/documentsApi';

export default function App() {
  const [ownerId, setOwnerId] = useState('');
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadDocuments() {
    if (!ownerId.trim()) {
      setDocuments([]);
      setError('Informe um usuario para listar e baixar documentos.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setDocuments(await listDocuments(ownerId));
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
        color: '#f5e8d0',
        background:
          'radial-gradient(circle at top, #4a1010 0%, #120b0b 45%, #060606 100%)',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <header
          style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            border: '1px solid rgba(255, 181, 71, 0.25)',
            borderRadius: '16px',
            background: 'rgba(17, 9, 9, 0.8)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
          }}
        >
          <p
            style={{
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: '#ffb547',
            }}
          >
            Rock your docs
          </p>
          <h1 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem' }}>
            Document Management System
          </h1>
          <p style={{ marginBottom: 0, color: '#d7c2a4' }}>
            Arquivos na estrada, download no volume máximo.
          </p>
        </header>

        <section
          style={{
            marginBottom: '1.5rem',
            padding: '1.5rem',
            borderRadius: '16px',
            background: 'rgba(25, 14, 14, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <label style={{ display: 'grid', gap: '0.5rem' }}>
              <span style={{ color: '#ffb547', fontWeight: 700 }}>Usuário</span>
              <input
                type="text"
                value={ownerId}
                onChange={(event) => setOwnerId(event.target.value)}
                placeholder="user_1"
                style={{
                  padding: '0.85rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 181, 71, 0.35)',
                  background: '#120b0b',
                  color: '#f5e8d0',
                }}
              />
            </label>
            <div>
              <button
                type="button"
                onClick={loadDocuments}
                disabled={loading}
                style={{
                  padding: '0.8rem 1.2rem',
                  border: 'none',
                  borderRadius: '999px',
                  background: loading ? '#6a4a25' : 'linear-gradient(135deg, #ff7a18, #ffb547)',
                  color: '#140b0b',
                  fontWeight: 800,
                  cursor: loading ? 'wait' : 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {loading ? 'Carregando...' : 'Carregar documentos'}
              </button>
            </div>
          </div>
          <h2 style={{ marginTop: 0, color: '#ffb547' }}>Upload</h2>
          <UploadComponent ownerId={ownerId} onUploaded={loadDocuments} />
        </section>

        <section
          style={{
            padding: '1.5rem',
            borderRadius: '16px',
            background: 'rgba(25, 14, 14, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <h2 style={{ marginTop: 0, color: '#ffb547' }}>Documentos</h2>
          {error ? <p style={{ color: '#ff8a7a' }}>{error}</p> : null}
          {!error && !documents.length && !ownerId.trim() ? (
            <p>Informe um usuário para visualizar os documentos dele.</p>
          ) : null}
          {ownerId.trim() ? <DocumentList documents={documents} ownerId={ownerId} /> : null}
        </section>
      </div>
    </main>
  );
}
