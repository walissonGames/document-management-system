import { useState } from 'react';
import { uploadDocument } from '../services/documentsApi';

export default function UploadComponent({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [ownerId, setOwnerId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!file) {
      setError('Selecione um arquivo para enviar.');
      return;
    }

    setLoading(true);

    try {
      await uploadDocument(file, ownerId);
      setFile(null);
      setOwnerId('');
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

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '0.9rem 1.2rem',
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
        {loading ? 'Enviando...' : 'Enviar documento'}
      </button>

      {error ? <p style={{ color: '#ff8a7a', margin: 0 }}>{error}</p> : null}
    </form>
  );
}
