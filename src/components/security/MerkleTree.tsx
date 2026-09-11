import { useState } from 'react';
import './Security.css';
import type { MerkleNode } from '../../types/security';

interface MerkleTreeProps {
  nodes: MerkleNode[];
}

export default function MerkleTree({ nodes }: MerkleTreeProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('ROOT');

  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const rootNode = nodes.find(n => n.id === 'ROOT');

  // Helper to render tree branches recursively
  const renderNode = (node: MerkleNode, level: number = 0) => {
    const children = node.children.map(childId => nodes.find(n => n.id === childId)).filter(Boolean) as MerkleNode[];
    const isSelected = selectedNodeId === node.id;
    
    return (
      <div key={node.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 8px' }}>
        <button
          onClick={() => setSelectedNodeId(node.id)}
          style={{
            background: isSelected ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border-subtle)'}`,
            borderRadius: 'var(--radius-sm)',
            padding: '8px 16px',
            color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontFamily: 'monospace',
            fontSize: '11px',
            cursor: 'pointer',
            minWidth: '120px',
            transition: 'all 0.2s ease',
            zIndex: 2
          }}
        >
          {node.type === 'ROOT' && <div style={{ fontSize: '9px', color: 'var(--accent)', marginBottom: '4px' }}>MERKLE ROOT</div>}
          {node.label}
        </button>

        {children.length > 0 && (
          <>
            <div style={{ width: '1px', height: '16px', background: 'var(--border-subtle)', zIndex: 1 }} />
            <div style={{ 
              display: 'flex', 
              position: 'relative',
              paddingTop: '16px' 
            }}>
              {/* Horizontal connecting line */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '25%',
                right: '25%',
                height: '1px',
                background: 'var(--border-subtle)',
                zIndex: 1
              }} />
              
              {children.map((child) => (
                <div key={child.id} style={{ position: 'relative' }}>
                  {/* Vertical connecting lines to children */}
                  <div style={{
                    position: 'absolute',
                    top: '-16px',
                    left: '50%',
                    width: '1px',
                    height: '16px',
                    background: 'var(--border-subtle)',
                    zIndex: 1
                  }} />
                  {renderNode(child, level + 1)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="security-panel">
      <div className="security-panel__header">
        <h3 className="security-panel__title">MERKLE TREE VISUALIZATION</h3>
      </div>
      
      <div style={{ overflowX: 'auto', padding: '24px 0', display: 'flex', justifyContent: 'center' }}>
        {rootNode && renderNode(rootNode)}
      </div>

      {selectedNode && (
        <div style={{ 
          marginTop: '16px', 
          padding: '16px', 
          background: 'rgba(0,0,0,0.3)', 
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 'var(--radius-sm)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="security-value-group">
              <span className="security-label">NODE TYPE</span>
              <span className="security-value security-value--highlight">{selectedNode.type}</span>
            </div>
            <div className="security-value-group">
              <span className="security-label">LABEL</span>
              <span className="security-value">{selectedNode.label}</span>
            </div>
            <div className="security-value-group" style={{ gridColumn: '1 / -1' }}>
              <span className="security-label">HASH</span>
              <span className="security-value" style={{ wordBreak: 'break-all', fontSize: '11px', color: 'var(--accent)' }}>
                {selectedNode.hash}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
