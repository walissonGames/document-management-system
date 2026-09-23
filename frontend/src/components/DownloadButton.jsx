import { useState } from 'react';
import { downloadDocument } from '../services/documentsApi';

export default function DownloadButton({ document, ownerId }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setError('');
    setLoading(true);

    try {
      await downloadDocument(document.id, ownerId, document.originalName);
    } catch (downloadError) {
      setError(downloadError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'grid', justifyItems: 'end', gap: '0.35rem' }}>
      <button
        type="button"
        onClick={handleDownload}
        disabled={loading}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.7rem 1rem',
          borderRadius: '999px',
          border: 'none',
          background: loading ? '#5b4d7c' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          color: '#fff',
          textDecoration: 'none',
          fontWeight: 700,
          cursor: loading ? 'wait' : 'pointer',
        }}
      >
        {loading ? 'Baixando...' : 'Baixar'}
      </button>
      {error ? <span style={{ color: '#ff8a7a', fontSize: '0.85rem' }}>{error}</span> : null}
    </div>
  );
}
