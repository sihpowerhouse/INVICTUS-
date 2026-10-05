import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './SettingsPage.css';

type SettingsSection = 'ACCOUNT' | 'SYSTEM' | 'SECURITY' | 'NOTIFICATIONS' | 'SYSTEM INFORMATION';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('ACCOUNT');
  const [appearance, setAppearance] = useState<'DARK' | 'LIGHT'>('DARK');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [commandShortcuts, setCommandShortcuts] = useState(true);
  const [opAlerts, setOpAlerts] = useState(true);
  const [evidenceAlerts, setEvidenceAlerts] = useState(true);
  const [accessAlerts, setAccessAlerts] = useState(false);

  const shouldReduceMotion = useReducedMotion() || reduceMotion;

  const sections: SettingsSection[] = [
    'ACCOUNT',
    'SYSTEM',
    'SECURITY',
    'NOTIFICATIONS',
    'SYSTEM INFORMATION'
  ];

  const contentVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 5 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'ACCOUNT':
        return (
          <motion.div className="settings-panel" variants={contentVariants} initial="hidden" animate="show" key="account">
            <h3 className="settings-panel-title">ACCOUNT CONFIGURATION</h3>
            
            <div className="settings-row">
              <div className="settings-info">
                <span className="settings-label">OPERATOR NAME</span>
                <span className="settings-desc">Primary authorized user for this session</span>
              </div>
              <div className="settings-value">DR. ALAN CROSS</div>
            </div>

            <div className="settings-row">
              <div className="settings-info">
                <span className="settings-label">ROLE</span>
              </div>
              <div className="settings-value">LEAD INVESTIGATOR</div>
            </div>

            <div className="settings-row">
              <div className="settings-info">
                <span className="settings-label">DEPARTMENT</span>
              </div>
              <div className="settings-value">FORENSIC INTELLIGENCE</div>
            </div>

            <div className="settings-row">
              <div className="settings-info">
                <span className="settings-label">SESSION STATUS</span>
              </div>
              <div className="settings-value status-active">ACTIVE / SECURE</div>
            </div>
          </motion.div>
        );
      case 'SYSTEM':
        return (
          <motion.div className="settings-panel" variants={contentVariants} initial="hidden" animate="show" key="system">
            <h3 className="settings-panel-title">SYSTEM PREFERENCES</h3>
            
            <div className="settings-row">
              <div className="settings-info">
                <span className="settings-label">APPEARANCE</span>
                <span className="settings-desc">Color palette and contrast mode</span>
              </div>
              <div className="settings-controls">
                <button 
                  className={`btn-toggle ${appearance === 'DARK' ? 'active' : ''}`}
                  onClick={() => setAppearance('DARK')}
                >DARK</button>
                <button 
                  className={`btn-toggle ${appearance === 'LIGHT' ? 'active' : ''}`}
                  onClick={() => setAppearance('LIGHT')}
                >LIGHT</button>
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-info">
                <span className="settings-label">MOTION PREFERENCE</span>
                <span className="settings-desc">Reduce UI animations and transitions</span>
              </div>
              <div className="settings-controls">
                <button 
                  className={`btn-toggle ${reduceMotion ? 'active' : ''}`}
                  onClick={() => setReduceMotion(!reduceMotion)}
                >{reduceMotion ? 'REDUCED' : 'STANDARD'}</button>
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-info">
                <span className="settings-label">COMMAND SHORTCUTS</span>
                <span className="settings-desc">Enable Command Ring keyboard shortcuts (Ctrl+K)</span>
              </div>
              <div className="settings-controls">
                <button 
                  className={`btn-toggle ${commandShortcuts ? 'active' : ''}`}
                  onClick={() => setCommandShortcuts(!commandShortcuts)}
                >{commandShortcuts ? 'ENABLED' : 'DISABLED'}</button>
              </div>
            </div>
          </motion.div>
        );
      case 'SECURITY':
        return (
          <motion.div className="settings-panel" variants={contentVariants} initial="hidden" animate="show" key="security">
            <h3 className="settings-panel-title">SECURITY PROTOCOLS</h3>
            
            <div className="settings-row">
              <div className="settings-info">
                <span className="settings-label">ACCESS LEVEL</span>
                <span className="settings-desc">Current clearance classification</span>
              </div>
              <div className="settings-value status-warning">TIER 3 (RESTRICTED)</div>
            </div>

            <div className="settings-row">
              <div className="settings-info">
                <span className="settings-label">2FA STATUS</span>
              </div>
              <div className="settings-value status-active">ENFORCED</div>
            </div>

            <div className="settings-row">
              <div className="settings-info">
                <span className="settings-label">SESSION EXPIRATION</span>
                <span className="settings-desc">Auto-lock timeout</span>
              </div>
              <div className="settings-value">15 MINUTES</div>
            </div>

            <div className="settings-row">
              <div className="settings-info">
                <span className="settings-label">RECENT SIGN-IN</span>
              </div>
              <div className="settings-value">10.0.0.45 (SECURE TERMINAL 04)</div>
            </div>
          </motion.div>
        );
      case 'NOTIFICATIONS':
        return (
          <motion.div className="settings-panel" variants={contentVariants} initial="hidden" animate="show" key="notifications">
            <h3 className="settings-panel-title">ALERT CONFIGURATION</h3>
            
            <div className="settings-row">
              <div className="settings-info">
                <span className="settings-label">OPERATIONAL ALERTS</span>
                <span className="settings-desc">Updates on case status and team activity</span>
              </div>
              <div className="settings-controls">
                <button 
                  className={`btn-toggle ${opAlerts ? 'active' : ''}`}
                  onClick={() => setOpAlerts(!opAlerts)}
                >{opAlerts ? 'ON' : 'OFF'}</button>
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-info">
                <span className="settings-label">EVIDENCE ALERTS</span>
                <span className="settings-desc">Chain of custody transfers and anomalies</span>
              </div>
              <div className="settings-controls">
                <button 
                  className={`btn-toggle ${evidenceAlerts ? 'active' : ''}`}
                  onClick={() => setEvidenceAlerts(!evidenceAlerts)}
                >{evidenceAlerts ? 'ON' : 'OFF'}</button>
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-info">
                <span className="settings-label">ACCESS REQUESTS</span>
                <span className="settings-desc">Notifications for clearance requests</span>
              </div>
              <div className="settings-controls">
                <button 
                  className={`btn-toggle ${accessAlerts ? 'active' : ''}`}
                  onClick={() => setAccessAlerts(!accessAlerts)}
                >{accessAlerts ? 'ON' : 'OFF'}</button>
              </div>
            </div>
          </motion.div>
        );
      case 'SYSTEM INFORMATION':
        return (
          <motion.div className="settings-panel" variants={contentVariants} initial="hidden" animate="show" key="sysinfo">
            <h3 className="settings-panel-title">SYSTEM DIAGNOSTICS</h3>
            
            <div className="settings-row">
              <div className="settings-info">
                <span className="settings-label">APPLICATION VERSION</span>
              </div>
              <div className="settings-value">INV-OS v4.12.0 (BUILD 8831)</div>
            </div>

            <div className="settings-row">
              <div className="settings-info">
                <span className="settings-label">ENVIRONMENT</span>
              </div>
              <div className="settings-value">PRODUCTION ENCLAVE</div>
            </div>

            <div className="settings-row">
              <div className="settings-info">
                <span className="settings-label">API STATUS</span>
              </div>
              <div className="settings-value status-active">CONNECTED / LATENCY 12ms</div>
            </div>

            <div className="settings-row">
              <div className="settings-info">
                <span className="settings-label">LAST SYNCHRONIZATION</span>
              </div>
              <div className="settings-value">{new Date().toLocaleString()}</div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1 className="settings-title">SYSTEM / SETTINGS</h1>
        <p className="settings-subtitle">System configuration and operator preferences</p>
      </div>

      <div className="settings-layout">
        <div className="settings-nav">
          {sections.map(section => (
            <button 
              key={section} 
              className={`settings-nav-item ${activeSection === section ? 'active' : ''}`}
              onClick={() => setActiveSection(section)}
            >
              {activeSection === section && !shouldReduceMotion && (
                <motion.div 
                  className="settings-nav-indicator"
                  layoutId="settings-nav-indicator"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              {section}
            </button>
          ))}
        </div>
        
        <div className="settings-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
