import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Clock, Upload, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import './DocumentActivityTimeline.css';

interface TimelineEvent {
  id: string;
  type: 'UPLOADED' | 'VERSION_CREATED' | 'OCR_STARTED' | 'OCR_COMPLETED' | 'OCR_FAILED' | 'VERSION_SUPERSEDED';
  timestamp: string;
  label: string;
  versionId: string;
  versionLabel: string;
  actor?: string;
}

interface DocumentActivityTimelineProps {
  versions: any[];
  selectedVersionId: string;
  onVersionSelect?: (versionId: string) => void;
}

export default function DocumentActivityTimeline({ versions, selectedVersionId, onVersionSelect }: DocumentActivityTimelineProps) {
  const shouldReduceMotion = useReducedMotion();

  const events = useMemo(() => {
    const sortedVersions = [...versions].sort((a, b) => a.version_number - b.version_number);
    const timeline: TimelineEvent[] = [];

    sortedVersions.forEach((v, index) => {
      const vLabel = `v${v.version_number}`;
      
      // Upload event
      timeline.push({
        id: `upload-${v.version_id}`,
        type: index === 0 ? 'UPLOADED' : 'VERSION_CREATED',
        timestamp: v.timestamp,
        label: index === 0 ? 'DOCUMENT UPLOADED' : 'VERSION CREATED',
        versionId: v.version_id,
        versionLabel: vLabel,
        actor: 'SYSTEM USER' // Using placeholder since user mapping isn't available
      });

      // OCR events
      if (v.ai_processing) {
        if (v.ai_processing.started_at || v.ai_processing.created_at) {
          timeline.push({
            id: `ocr-start-${v.version_id}`,
            type: 'OCR_STARTED',
            timestamp: v.ai_processing.started_at || v.ai_processing.created_at,
            label: 'OCR PROCESSING STARTED',
            versionId: v.version_id,
            versionLabel: vLabel
          });
        }
        
        if (v.ai_processing.status === 'completed' && v.ai_processing.completed_at) {
          timeline.push({
            id: `ocr-complete-${v.version_id}`,
            type: 'OCR_COMPLETED',
            timestamp: v.ai_processing.completed_at,
            label: 'OCR PROCESSING COMPLETED',
            versionId: v.version_id,
            versionLabel: vLabel
          });
        } else if (v.ai_processing.status === 'failed' && v.ai_processing.completed_at) {
          timeline.push({
            id: `ocr-fail-${v.version_id}`,
            type: 'OCR_FAILED',
            timestamp: v.ai_processing.completed_at,
            label: 'OCR PROCESSING FAILED',
            versionId: v.version_id,
            versionLabel: vLabel
          });
        }
      }

      // Superseded event
      if (index < sortedVersions.length - 1) {
        const nextVersion = sortedVersions[index + 1];
        timeline.push({
          id: `supersede-${v.version_id}`,
          type: 'VERSION_SUPERSEDED',
          timestamp: nextVersion.timestamp,
          label: 'VERSION SUPERSEDED',
          versionId: v.version_id,
          versionLabel: vLabel
        });
      }
    });

    return timeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [versions]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${date} · ${time}`;
  };

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'UPLOADED':
      case 'VERSION_CREATED':
        return <Upload size={14} />;
      case 'OCR_STARTED':
        return <FileText size={14} />;
      case 'OCR_COMPLETED':
        return <CheckCircle size={14} />;
      case 'OCR_FAILED':
      case 'VERSION_SUPERSEDED':
        return <AlertTriangle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  if (!events.length) return null;

  return (
    <div className="doc-activity-timeline">
      <div className="doc-activity-header">
        <h3>DOCUMENT ACTIVITY</h3>
      </div>
      <div className="doc-activity-list">
        {events.map((event, idx) => {
          const isSelected = event.versionId === selectedVersionId;
          return (
            <motion.div 
              key={event.id}
              className={`doc-activity-item ${isSelected ? 'is-selected' : ''} type-${event.type.toLowerCase()}`}
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: shouldReduceMotion ? 0 : idx * 0.05 }}
              onClick={() => onVersionSelect?.(event.versionId)}
              role="button"
              tabIndex={0}
            >
              <div className="doc-activity-icon">
                {getEventIcon(event.type)}
              </div>
              <div className="doc-activity-content">
                <div className="doc-activity-timestamp">{formatDate(event.timestamp)}</div>
                <div className="doc-activity-label">{event.label}</div>
                <div className="doc-activity-meta">
                  <span className="doc-activity-version">Version {event.versionLabel}</span>
                  {event.actor && <span className="doc-activity-actor">by {event.actor}</span>}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
