import './PersonsPanel.css';
import type { CasePerson } from '../../types/case';

interface PersonsPanelProps {
  persons?: CasePerson[];
}

export default function PersonsPanel({ persons = [] }: PersonsPanelProps) {
  return (
    <div className="data-panel">
      <div className="data-panel-header">
        <h3 className="data-panel-title">PERSONS INVOLVED</h3>
      </div>
      <div className="data-panel-content">
        {persons.length === 0 ? (
          <div className="data-list-empty">NO PERSONS RECORDED</div>
        ) : (
          <div className="data-list">
            {persons.map(person => (
              <div key={person.id} className="data-list-item">
                <div className="person-name">{person.name}</div>
                <div>
                  <span className="person-role" data-role={person.role}>{person.role}</span>
                </div>
                <div className="person-relevance">{person.relevance}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
