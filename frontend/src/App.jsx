import { useEffect, useState } from 'react';
import DocumentList from './components/DocumentList';
import UploadComponent from './components/UploadComponent';
import { listDocuments } from './services/documentsApi';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState('');

  async function loadDocuments() {
    try {
      setError('');
      setDocuments(await listDocuments());
    } catch (loadError) {
      setError(loadError.message);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

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
        <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#ffb547' }}>
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
        <h2 style={{ marginTop: 0, color: '#ffb547' }}>Upload</h2>
        <UploadComponent onUploaded={loadDocuments} />
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
        <DocumentList documents={documents} />
      </section>
      </div>
    </main>
  );
}
