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
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>Document Management System</h1>

      <section>
        <h2>Upload</h2>
        <UploadComponent onUploaded={loadDocuments} />
      </section>

      <section>
        <h2>Documentos</h2>
        {error ? <p>{error}</p> : null}
        <DocumentList documents={documents} />
      </section>
    </main>
  );
}
