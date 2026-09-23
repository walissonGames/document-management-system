import DownloadButton from './DownloadButton';

function formatUploadedAt(uploadedAt) {
  return new Date(uploadedAt).toLocaleString('pt-BR');
}

function formatSize(size) {
  if (size < 1024) {
    return `${size} B`;
  }

  return `${(size / 1024).toFixed(1)} KB`;
}

export default function DocumentList({ documents, ownerId }) {
  if (!documents.length) {
    return <p>Nenhum documento enviado.</p>;
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
      {documents.map((document) => (
        <li
          key={document.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            padding: '1rem',
            borderRadius: '14px',
            background: '#120b0b',
            border: '1px solid rgba(255, 181, 71, 0.18)',
          }}
        >
          <div>
            <strong style={{ display: 'block', color: '#fff3db' }}>{document.originalName}</strong>
            <span style={{ display: 'block', color: '#c9b08b', fontSize: '0.92rem' }}>
              {document.ownerId}
            </span>
            <span style={{ color: '#c9b08b', fontSize: '0.85rem' }}>
              {formatSize(document.size)} • {formatUploadedAt(document.uploadedAt)}
            </span>
          </div>
          <DownloadButton document={document} ownerId={ownerId} />
        </li>
      ))}
    </ul>
  );
}
