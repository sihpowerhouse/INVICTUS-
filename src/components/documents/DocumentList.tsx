import { motion, useReducedMotion } from 'framer-motion';
import type { Document } from '../../types/document';
import DocumentListItem from './DocumentListItem';
import './DocumentList.css';

interface DocumentListProps {
  groupedDocuments: Record<string, Document[]>;
  itemVariants: any;
}

export default function DocumentList({ groupedDocuments, itemVariants }: DocumentListProps) {
  const shouldReduceMotion = useReducedMotion();

  const titleVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 5 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as any }
    }
  };

  const hasDocuments = Object.values(groupedDocuments).some(group => group.length > 0);

  if (!hasDocuments) {
    return (
      <motion.div className="cases-page__empty" variants={itemVariants}>
        NO DOCUMENTS MATCH CURRENT FILTERS
      </motion.div>
    );
  }

  return (
    <div className="document-list">
      <div className="doc-registry-header">
        <div>DOCUMENT</div>
        <div>TYPE</div>
        <div>CASE</div>
        <div>VERSION</div>
        <div>STATUS</div>
        <div>CONFIDENCE</div>
        <div>LAST UPDATED</div>
        <div className="doc-action-col">ACTION</div>
      </div>
      
      {Object.entries(groupedDocuments).map(([groupName, docs]) => {
        if (docs.length === 0) return null;

        return (
          <div key={groupName} className="document-list__group">
            <motion.h3 
              className="document-list__group-title"
              variants={titleVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-20px" }}
            >
              {groupName}
            </motion.h3>
            <div className="document-list__items">
              {docs.map(doc => (
                <DocumentListItem key={doc.id} document={doc} itemVariants={itemVariants} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
