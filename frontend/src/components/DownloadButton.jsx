import { getDocumentDownloadUrl } from '../services/documentsApi';

export default function DownloadButton({ document }) {
  return (
    <a
      href={getDocumentDownloadUrl(document.id)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.7rem 1rem',
        borderRadius: '999px',
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        color: '#fff',
        textDecoration: 'none',
        fontWeight: 700,
      }}
    >
      Baixar
    </a>
  );
}
