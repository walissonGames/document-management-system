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
    <form onSubmit={handleSubmit}>
      <label>
        Arquivo
        <input
          type="file"
          onChange={(event) => setFile(event.target.files[0] || null)}
        />
      </label>

      <label>
        Usuário
        <input
          type="text"
          value={ownerId}
          onChange={(event) => setOwnerId(event.target.value)}
          placeholder="user_1"
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar documento'}
      </button>

      {error ? <p>{error}</p> : null}
    </form>
  );
}
