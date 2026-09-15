import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Department } from '../../types/department';
import './DepartmentCommandRing.css';

interface DepartmentCommandRingProps {
  departments: Department[];
}

export default function DepartmentCommandRing({ departments }: DepartmentCommandRingProps) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [radius, setRadius] = useState(250); // Default radius

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        // Calculate responsive radius based on available container dimension.
        // We leave space for the nodes and labels (approx 120px margin total).
        const minDimension = Math.min(width, height);
        const calculatedRadius = Math.max(100, (minDimension - 140) / 2);
        
        // Cap the radius so it doesn't get absurdly huge on ultrawide monitors
        setRadius(Math.min(calculatedRadius, 320));
      }
    };
    
    handleResize(); // Initial calculation
    
    const observer = new ResizeObserver(() => handleResize());
    if (containerRef.current) observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, []);

  const hoveredDept = departments.find(d => d.id === hoveredId);

  return (
    <div className="command-ring" ref={containerRef}>
      {/* Contextual Detail Panel (Moved out of center, positioned top-left of container) */}
      {hoveredDept && (
        <div className="command-panel">
          <h4 className="command-panel__title">{hoveredDept.title}</h4>
          
          <div className="command-panel__list">
            <div className="command-panel__stat">
              <span>Status</span>
              <span className="command-panel__stat-val">{hoveredDept.status}</span>
            </div>
            <div className="command-panel__stat">
              <span>Active Workload</span>
              <span className="command-panel__stat-val command-panel__stat-val--accent">{hoveredDept.activeWorkload} ITEMS</span>
            </div>
            <div className="command-panel__stat">
              <span>Primary Function</span>
              <span className="command-panel__stat-val">{hoveredDept.actions[0]?.label || 'N/A'}</span>
            </div>
          </div>
          
          <div className="command-panel__action">
            ENTER WORKSPACE
          </div>
        </div>
      )}

      {/* SVG Layer: Connecting Lines & Orbits */}
      <svg className="command-ring__svg" aria-hidden="true">
        {/* Secondary faint dashed orbit */}
        <circle cx="50%" cy="50%" r={radius - 60} className="command-ring__orbit command-ring__orbit--secondary" />
        {/* Primary orbit */}
        <circle cx="50%" cy="50%" r={radius} className="command-ring__orbit" />
        
        {departments.map((dept, index) => {
          const angle = -90 + (index * (360 / departments.length));
          const isHovered = hoveredId === dept.id;
          const isDimmed = hoveredId !== null && !isHovered;
          
          return (
            <line 
              key={`line-${dept.id}`}
              x1="50%" 
              y1="50%" 
              x2={`calc(50% + ${Math.cos((angle * Math.PI) / 180) * radius}px)`} 
              y2={`calc(50% + ${Math.sin((angle * Math.PI) / 180) * radius}px)`} 
              className={`command-ring__line ${isHovered ? 'command-ring__line--active' : ''} ${isDimmed ? 'command-ring__line--dimmed' : ''}`}
            />
          );
        })}
      </svg>

      {/* Central Core */}
      <div className="command-core">
        <svg className="command-core__reticle" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" strokeDasharray="2 6" className="command-core__reticle-inner" />
          <circle cx="50" cy="50" r="40" strokeDasharray="4 12" style={{ opacity: 0.6 }} />
          {/* Tick marks */}
          <line x1="50" y1="0" x2="50" y2="4" stroke="var(--accent)" strokeWidth="1.5" />
          <line x1="50" y1="96" x2="50" y2="100" stroke="var(--accent)" strokeWidth="1.5" />
          <line x1="0" y1="50" x2="4" y2="50" stroke="var(--accent)" strokeWidth="1.5" />
          <line x1="96" y1="50" x2="100" y2="50" stroke="var(--accent)" strokeWidth="1.5" />
        </svg>

        <div className="command-core__title">INVICTUS</div>
        <div className="command-core__subtitle">INTELLIGENCE CORE</div>
        <div className="command-core__prompt">SELECT DEPARTMENT</div>
      </div>

      {/* Orbital Nodes */}
      {departments.map((dept, index) => {
        const angle = -90 + (index * (360 / departments.length));
        const offsetX = Math.cos((angle * Math.PI) / 180) * radius;
        const offsetY = Math.sin((angle * Math.PI) / 180) * radius;
        
        const isHovered = hoveredId === dept.id;
        const isDimmed = hoveredId !== null && !isHovered;
        
        const Icon = dept.icon;

        return (
          <button
            key={dept.id}
            className={`command-node ${isHovered ? 'command-node--active' : ''} ${isDimmed ? 'command-node--dimmed' : ''}`}
            style={{
              left: `calc(50% + ${offsetX}px)`,
              top: `calc(50% + ${offsetY}px)`,
            }}
            onMouseEnter={() => setHoveredId(dept.id)}
            onMouseLeave={() => setHoveredId(null)}
            onFocus={() => setHoveredId(dept.id)}
            onBlur={() => setHoveredId(null)}
            onClick={() => {
              const pathMap: Record<string, string> = {
                'POLICE': '/cases',
                'RECORDS': '/documents',
                'CYBER': '/evidence',
              };
              navigate(pathMap[dept.id] || `/${dept.id.toLowerCase()}`);
            }}
            aria-label={`${dept.title} Department Workspace`}
          >
            <Icon size={14} className="command-node__icon" strokeWidth={1.5} />
            <span className="command-node__label">{dept.title}</span>
          </button>
        );
      })}
    </div>
  );
}
