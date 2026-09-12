import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import './ChainOfCustody.css';
import type { CustodyEvent } from '../../types/evidence';

interface ChainOfCustodyProps {
  events: CustodyEvent[];
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate().toString().padStart(2, '0');
  const month = d.toLocaleString('en', { month: 'short' }).toUpperCase();
  const year = d.getFullYear();
  const time = d.toTimeString().slice(0, 5);
  return `${day} ${month} ${year} · ${time}`;
}

export default function ChainOfCustody({ events }: ChainOfCustodyProps) {
  const [expandedId, setExpandedId] = useState<string | null>(events[0]?.id || null);
  const shouldReduceMotion = useReducedMotion();

  // Sort: newest first
  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="coc">
      <div className="coc__header">
        <h3 className="coc__title">CHAIN OF CUSTODY</h3>
        <span className="coc__count">{events.length} EVENTS</span>
      </div>

      <div className="coc__timeline" role="list">
        {sorted.map((event, index) => {
          const isCurrent = index === 0;
          const isExpanded = expandedId === event.id;

          let cls = 'coc__event';
          if (isCurrent) cls += ' coc__event--current';
          else if (index === 1) cls += ' coc__event--past-1';
          else if (index === 2) cls += ' coc__event--past-2';
          else cls += ' coc__event--past-old';

          if (isExpanded) cls += ' is-expanded';

          return (
            <motion.div
              layout={!shouldReduceMotion}
              key={event.id}
              className={cls}
              role="listitem"
              onClick={() => setExpandedId(isExpanded ? null : event.id)}
            >
              <div className="coc__track">
                <div className="coc__dot" aria-hidden="true" />
                {index < sorted.length - 1 && (
                  <div className="coc__line" aria-hidden="true" />
                )}
              </div>

              <motion.div layout={!shouldReduceMotion} className="coc__content">
                <div className="coc__event-head">
                  <span className="coc__action">
                    {event.action.replace(/_/g, ' ')}
                  </span>
                  {isCurrent && (
                    <span className="coc__current-tag">CURRENT</span>
                  )}
                  <time className="coc__timestamp" dateTime={event.timestamp}>
                    {formatTimestamp(event.timestamp)}
                  </time>
                </div>

                <div className="coc__actor-row">
                  <span className="coc__actor">{event.actor}</span>
                  <span className="coc__dept-sep" aria-hidden="true">·</span>
                  <span className="coc__dept">{event.department}</span>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                      className="coc__details"
                    >
                      {event.location && (
                        <div className="coc__detail-row">
                          <span className="coc__detail-label">LOCATION</span>
                          <span className="coc__detail-value">{event.location}</span>
                        </div>
                      )}
                      {event.note && (
                        <div className="coc__detail-row">
                          <span className="coc__detail-label">NOTE</span>
                          <span className="coc__detail-value">{event.note}</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
