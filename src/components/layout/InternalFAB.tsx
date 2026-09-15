import { useState } from 'react';
import { Plus, Upload, FileText } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../i18n/I18nProvider';
import { motion, AnimatePresence } from 'framer-motion';
import './InternalFAB.css';

export default function InternalFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { t } = useI18n();

  // Ensure this only shows for internal users (double check)
  if (user?.userType === 'EXTERNAL') {
    return null;
  }

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="internal-fab-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="internal-fab-menu"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <button className="internal-fab-item">
              <span className="internal-fab-label">{t('fab.fir')}</span>
              <div className="internal-fab-icon-wrapper">
                <FileText size={16} />
              </div>
            </button>
            <button className="internal-fab-item">
              <span className="internal-fab-label">{t('fab.upload')}</span>
              <div className="internal-fab-icon-wrapper">
                <Upload size={16} />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        className={`internal-fab-main ${isOpen ? 'open' : ''}`}
        onClick={toggleOpen}
        aria-label="Quick Actions"
      >
        <Plus size={24} className="internal-fab-plus" />
      </button>
    </div>
  );
}
