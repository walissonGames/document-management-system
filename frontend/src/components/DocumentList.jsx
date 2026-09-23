import DownloadButton from './DownloadButton';

export default function DocumentList({ documents }) {
  if (!documents.length) {
    return <p>Nenhum documento enviado.</p>;
  }

  return (
    <ul>
      {documents.map((document) => (
        <li key={document.id}>
          <strong>{document.originalName}</strong>
          <span> - {document.ownerId}</span>
          <DownloadButton document={document} />
        </li>
      ))}
    </ul>
  );
}
