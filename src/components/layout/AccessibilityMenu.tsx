import { useState, useRef, useEffect } from 'react';
import { Settings2 } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useI18n } from '../../i18n/I18nProvider';
import './AccessibilityMenu.css';

export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { highContrast, setHighContrast, textSize, setTextSize } = useAccessibility();
  const { language, setLanguage, t } = useI18n();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="a11y-menu-container" ref={menuRef}>
      <button 
        className="top-nav__icon-btn" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Accessibility Settings"
      >
        <Settings2 size={16} />
      </button>

      {isOpen && (
        <div className="a11y-menu-dropdown">
          <div className="a11y-section">
            <h4 className="a11y-title">LANGUAGE</h4>
            <div className="a11y-btn-group">
              <button 
                className={`a11y-btn ${language === 'EN' ? 'active' : ''}`}
                onClick={() => setLanguage('EN')}
              >EN</button>
              <button 
                className={`a11y-btn ${language === 'TE' ? 'active' : ''}`}
                onClick={() => setLanguage('TE')}
              >TE</button>
              <button 
                className={`a11y-btn ${language === 'HI' ? 'active' : ''}`}
                onClick={() => setLanguage('HI')}
              >HI</button>
            </div>
          </div>

          <div className="a11y-section">
            <h4 className="a11y-title">{t('accessibility.contrast')}</h4>
            <label className="a11y-toggle">
              <input 
                type="checkbox" 
                checked={highContrast} 
                onChange={(e) => setHighContrast(e.target.checked)}
              />
              <span className="a11y-slider"></span>
            </label>
          </div>

          <div className="a11y-section">
            <h4 className="a11y-title">{t('accessibility.text_size')}</h4>
            <div className="a11y-btn-group">
              <button 
                className={`a11y-btn ${textSize === 'STANDARD' ? 'active' : ''}`}
                onClick={() => setTextSize('STANDARD')}
                style={{ fontSize: '12px' }}
              >A</button>
              <button 
                className={`a11y-btn ${textSize === 'LARGE' ? 'active' : ''}`}
                onClick={() => setTextSize('LARGE')}
                style={{ fontSize: '14px' }}
              >A</button>
              <button 
                className={`a11y-btn ${textSize === 'EXTRA_LARGE' ? 'active' : ''}`}
                onClick={() => setTextSize('EXTRA_LARGE')}
                style={{ fontSize: '16px' }}
              >A</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
