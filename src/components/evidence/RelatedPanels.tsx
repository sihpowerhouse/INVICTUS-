import { useNavigate } from 'react-router-dom';
import './RelatedPanels.css';

interface RelatedDocumentsProps {
  documentIds: string[];
}

// Relationship label per doc ID prefix — demo only
const DOC_RELATIONSHIP: Record<string, string> = {
  'DOC-26190-001': 'REPORT',
  'DOC-26190-002': 'ATTACHMENT',
  'DOC-26190-003': 'REFERENCE',
};

const DOC_NAME: Record<string, string> = {
  'DOC-26190-001': 'Forensic Examination Report',
  'DOC-26190-002': 'Interrogation Transcript — Subject A',
  'DOC-26190-003': 'Scene Photographs Manifest',
};

export function RelatedDocuments({ documentIds }: RelatedDocumentsProps) {
  const navigate = useNavigate();

  return (
    <div className="related-docs">
      <div className="related-docs__header">
        <h3 className="related-docs__title">RELATED DOCUMENTS</h3>
      </div>
      {documentIds.length === 0 ? (
        <p className="related-docs__empty">NO DOCUMENTS LINKED</p>
      ) : (
        <div className="related-docs__list" role="list">
          {documentIds.map(id => (
            <div
              key={id}
              className="related-docs__item"
              role="listitem"
              tabIndex={0}
              onClick={() => navigate(`/documents/${id}`)}
              onKeyDown={e => e.key === 'Enter' && navigate(`/documents/${id}`)}
              aria-label={`View document ${DOC_NAME[id] ?? id}`}
            >
              <span className="related-docs__icon">⊞</span>
              <span className="related-docs__name">{DOC_NAME[id] ?? id}</span>
              <span className="related-docs__rel">
                {DOC_RELATIONSHIP[id] ?? 'LINKED'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface MediaEntry {
  id: string;
  name: string;
  type: string;
  meta: string;
}

const MEDIA_DATA: Record<string, MediaEntry> = {
  'MEDIA-26190-001': { id: 'MEDIA-26190-001', name: 'CCTV Export — Sector 9 — 09 SEP', type: 'IMAGE', meta: '48 FRAMES' },
  'MEDIA-26190-002': { id: 'MEDIA-26190-002', name: 'Interrogation Audio — Primary Subject', type: 'AUDIO', meta: '1H 42M' },
};

interface RelatedMediaProps {
  mediaIds: string[];
}

export function RelatedMedia({ mediaIds }: RelatedMediaProps) {
  return (
    <div className="related-media">
      <div className="related-media__header">
        <h3 className="related-media__title">RELATED MEDIA</h3>
      </div>
      {mediaIds.length === 0 ? (
        <p className="related-media__empty">NO MEDIA LINKED</p>
      ) : (
        <div className="related-media__list" role="list">
          {mediaIds.map(id => {
            const entry = MEDIA_DATA[id];
            return (
              <div key={id} className="related-media__item" role="listitem">
                <span className="related-media__type-badge">
                  {entry?.type ?? 'MEDIA'}
                </span>
                <span className="related-media__name">{entry?.name ?? id}</span>
                <span className="related-media__meta">{entry?.meta ?? ''}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
