import { useState } from 'react';
import { uploadDocument } from '../services/documentsApi';

export default function UploadComponent({ ownerId, onUploaded }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!file) {
      setError('Selecione um arquivo para enviar.');
      return;
    }

    if (!ownerId.trim()) {
      setError('Informe um usuario antes de enviar o documento.');
      return;
    }

    setLoading(true);

    try {
      await uploadDocument(file, ownerId);
      setFile(null);
      event.target.reset();
      if (onUploaded) {
        onUploaded();
      }
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
      <label style={{ display: 'grid', gap: '0.5rem' }}>
        <span style={{ color: '#ffb547', fontWeight: 700 }}>Arquivo</span>
        <input
          type="file"
          style={{
            padding: '0.85rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 181, 71, 0.35)',
            background: '#120b0b',
            color: '#f5e8d0',
          }}
          onChange={(event) => setFile(event.target.files[0] || null)}
        />
      </label>

      <label style={{ display: 'grid', gap: '0.5rem' }}>
        <span style={{ color: '#ffb547', fontWeight: 700 }}>Usuário atual</span>
        <div
          style={{
            padding: '0.85rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 181, 71, 0.35)',
            background: '#120b0b',
            color: '#f5e8d0',
          }}
        >
          {ownerId || 'Informe um usuário acima para continuar.'}
        </div>
      </label>

      <button
        type="submit"
        disabled={loading || !ownerId.trim()}
        style={{
          padding: '0.9rem 1.2rem',
          border: 'none',
          borderRadius: '999px',
          background:
            loading || !ownerId.trim()
              ? '#6a4a25'
              : 'linear-gradient(135deg, #ff7a18, #ffb547)',
          color: '#140b0b',
          fontWeight: 800,
          cursor: loading ? 'wait' : ownerId.trim() ? 'pointer' : 'not-allowed',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {loading ? 'Enviando...' : 'Enviar documento'}
      </button>

      {error ? <p style={{ color: '#ff8a7a', margin: 0 }}>{error}</p> : null}
    </form>
  );
}
