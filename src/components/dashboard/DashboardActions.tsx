import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText } from 'lucide-react';
import './DashboardActions.css';

export default function DashboardActions() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/cases?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="dashboard-actions">
      <div className="dashboard-actions__section">
        <div className="dashboard-actions__label">CASE SEARCH</div>
        <form className="dashboard-search" onSubmit={handleSearch}>
          <input 
            type="text" 
            className="dashboard-search__input"
            placeholder="SEARCH FIR / CASE ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="dashboard-search__btn">
            <Search size={16} />
          </button>
          <div className="dashboard-search__glow" />
        </form>
      </div>

      <div className="dashboard-actions__section">
        <div className="dashboard-actions__label">PRIMARY ACTION</div>
        <button 
          className="dashboard-action-btn"
          onClick={() => navigate('/cases/new')}
        >
          <FileText size={16} />
          <span>+ FILE NEW FIR</span>
          <div className="dashboard-action-btn__sweep" />
        </button>
      </div>
    </div>
  );
}
