import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './CaseGroup.css';

interface CaseGroupProps {
  title: string;
  children: ReactNode;
}

export default function CaseGroup({ title, children }: CaseGroupProps) {
  const shouldReduceMotion = useReducedMotion();

  const titleVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 5 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as any }
    }
  };

  return (
    <div className="case-group">
      <motion.h3 
        className="case-group__title"
        variants={titleVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-20px" }}
      >
        {title}
      </motion.h3>
      <div className="case-group__items">
        {children}
      </div>
    </div>
  );
}
