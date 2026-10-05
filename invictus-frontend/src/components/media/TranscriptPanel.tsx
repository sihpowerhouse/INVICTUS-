import { useMemo, useRef, useEffect } from 'react';
import './TranscriptPanel.css';
import type { TranscriptLine } from '../../types/media';
import SpeakerBadge from './SpeakerBadge';
import TranscriptSearch from './TranscriptSearch';

interface TranscriptPanelProps {
  lines: TranscriptLine[];
  currentTimeMs: number;
  onTimeSelect: (timeMs: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function TranscriptPanel({
  lines,
  currentTimeMs,
  onTimeSelect,
  searchQuery,
  onSearchChange
}: TranscriptPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Find the active line
  let activeIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const isLast = i === lines.length - 1;
    const start = lines[i].timestampMs;
    const nextStart = isLast ? Infinity : lines[i + 1].timestampMs;

    if (currentTimeMs >= start && currentTimeMs < nextStart) {
      activeIndex = i;
      break;
    }
  }

  // Auto-scroll logic (basic)
  useEffect(() => {
    if (activeIndex >= 0 && containerRef.current) {
      const activeEl = containerRef.current.querySelector('.transcript-line--current') as HTMLElement;
      if (activeEl) {
        // Only scroll if it's far out of view to avoid jank while playing
        const rect = activeEl.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        if (rect.top < containerRect.top || rect.bottom > containerRect.bottom) {
          activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [activeIndex]);

  const filteredLines = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return lines;
    return lines.filter(l => 
      l.text.toLowerCase().includes(q) || 
      l.speaker.toLowerCase().includes(q)
    );
  }, [lines, searchQuery]);

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={i} className="transcript-highlight">{part}</mark>
        : part
    );
  };

  return (
    <div className="transcript-panel">
      <div className="transcript-panel__header">
        <h3 className="transcript-panel__title">TRANSCRIPT</h3>
        <TranscriptSearch 
          query={searchQuery} 
          onQueryChange={onSearchChange} 
          resultCount={filteredLines.length} 
        />
      </div>

      <div className="transcript-panel__body" ref={containerRef} role="list" aria-label="Media transcript">
        {lines.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '12px' }}>
            NO TRANSCRIPT AVAILABLE.
          </div>
        ) : filteredLines.map((line, index) => {
          const isOriginalActive = index === activeIndex;
          const isPast = index < activeIndex;
          
          let stateClass = 'transcript-line--future';
          if (isOriginalActive) stateClass = 'transcript-line--current';
          else if (isPast) stateClass = 'transcript-line--past';

          // Override if searching
          if (searchQuery.trim().length > 0) {
            stateClass = 'transcript-line--current'; // ensure visibility when filtered
          }

          return (
            <div 
              key={line.id} 
              className={`transcript-line ${stateClass}`}
              onClick={() => onTimeSelect(line.timestampMs)}
              role="listitem"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onTimeSelect(line.timestampMs)}
            >
              <div className="transcript-line__meta">
                <span className="transcript-line__time">{line.timestamp}</span>
                <SpeakerBadge speaker={line.speaker} />
              </div>
              <div className="transcript-line__text">
                {highlightText(line.text, searchQuery)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
