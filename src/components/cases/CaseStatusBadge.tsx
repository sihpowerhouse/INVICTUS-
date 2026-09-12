import './CaseStatusBadge.css';
import type { CaseStatus, CasePriority, CaseAttention } from '../../types/case';

interface CaseStatusBadgeProps {
  type: 'status' | 'priority' | 'attention';
  value: CaseStatus | CasePriority | CaseAttention;
  label?: string; // For custom text like attentionDetails
}

/**
 * Technical badge for case status, priority, or attention.
 */
export default function CaseStatusBadge({ type, value, label }: CaseStatusBadgeProps) {
  if (type === 'attention' && value === 'NONE') return null;

  const variantClass = `case-badge--${type}-${value.toLowerCase()}`;
  const displayText = label || value.replace('_', ' ');
  
  return (
    <span className={`case-badge ${variantClass}`}>
      <span className="case-badge__dot"></span>
      <span className="case-badge__text">{displayText}</span>
    </span>
  );
}
