import type { ReactNode } from 'react';
import './CaseGroup.css';

interface CaseGroupProps {
  title: string;
  children: ReactNode;
}

export default function CaseGroup({ title, children }: CaseGroupProps) {
  return (
    <div className="case-group">
      <h3 className="case-group__title">{title}</h3>
      {children}
    </div>
  );
}
