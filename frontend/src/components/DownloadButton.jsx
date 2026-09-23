import { getDocumentDownloadUrl } from '../services/documentsApi';

export default function DownloadButton({ document }) {
  return (
    <a href={getDocumentDownloadUrl(document.id)}>
      Baixar
    </a>
  );
}
