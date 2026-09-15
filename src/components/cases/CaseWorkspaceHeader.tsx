import { FileText, Upload, Users, BrainCircuit, Clock } from 'lucide-react';
import './CaseWorkspaceHeader.css';

interface CaseWorkspaceHeaderProps {
  activeTab: 'FILES' | 'MEMBERS' | 'TIMELINE' | 'CASE AI';
  onActionSelect: (action: 'FILES' | 'UPLOAD' | 'MEMBERS' | 'AI' | 'TIMELINE' | 'CASE AI') => void;
}

export default function CaseWorkspaceHeader({ activeTab, onActionSelect }: CaseWorkspaceHeaderProps) {
  return (
    <div className="case-workspace-header">
      <div className="workspace-actions">
        <button 
          className={`workspace-action-btn ${activeTab === 'FILES' ? 'active' : ''}`} 
          onClick={() => onActionSelect('FILES')}
        >
          <FileText size={16} />
          <span>FILES</span>
        </button>
        <button 
          className={`workspace-action-btn ${activeTab === 'MEMBERS' ? 'active' : ''}`} 
          onClick={() => onActionSelect('MEMBERS')}
        >
          <Users size={16} />
          <span>MEMBERS</span>
        </button>
        <button 
          className={`workspace-action-btn ${activeTab === 'TIMELINE' ? 'active' : ''}`} 
          onClick={() => onActionSelect('TIMELINE')}
        >
          <Clock size={16} />
          <span>TIMELINE</span>
        </button>
        <button 
          className={`workspace-action-btn ${activeTab === 'CASE AI' ? 'active' : ''}`} 
          onClick={() => onActionSelect('CASE AI')}
        >
          <BrainCircuit size={16} />
          <span>CASE AI</span>
        </button>
        <div style={{ flex: 1 }}></div>
        <button className="workspace-action-btn" onClick={() => onActionSelect('UPLOAD')}>
          <Upload size={16} />
          <span>UPLOAD EVIDENCE</span>
        </button>
      </div>
    </div>
  );
}
