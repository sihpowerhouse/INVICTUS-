import { useParams, useNavigate } from 'react-router-dom';
import DocumentViewerOverlay from '../components/documents/DocumentViewerOverlay';

export default function DocumentDetailsPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();

  if (!documentId) return null;

  return (
    <div style={{ height: '100%', width: '100%', background: 'var(--bg-primary)' }}>
      <DocumentViewerOverlay 
        documentId={documentId} 
        onClose={() => navigate(-1)} 
      />
    </div>
  );
}
