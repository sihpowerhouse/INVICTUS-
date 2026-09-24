import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import './InvictusSelect.css';

export interface InvictusSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface InvictusSelectProps {
  label?: string;
  value: string;
  options: InvictusSelectOption[];
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export default function InvictusSelect({ 
  label, 
  value, 
  options, 
  onChange, 
  placeholder = 'Select...', 
  className = '', 
  style,
  disabled = false
}: InvictusSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number; bottom: number } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        bottom: window.innerHeight - rect.bottom - 4 // Space available below
      });
    }
  };

  useLayoutEffect(() => {
    if (isOpen) {
      updateCoords();
      // Handle scroll to update coords or close
      const handleScroll = () => {
        updateCoords();
      };
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        triggerRef.current && !triggerRef.current.contains(event.target as Node) &&
        popoverRef.current && !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Sync internal focus index when opening
  useEffect(() => {
    if (isOpen) {
      const idx = options.findIndex(opt => opt.value === value);
      setFocusedIndex(idx >= 0 ? idx : 0);
    } else {
      setFocusedIndex(-1);
    }
  }, [isOpen, value, options]);

  // Keyboard Navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => {
          let next = prev + 1;
          while (next < options.length && options[next].disabled) next++;
          return next < options.length ? next : prev;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => {
          let next = prev - 1;
          while (next >= 0 && options[next].disabled) next--;
          return next >= 0 ? next : prev;
        });
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(options.findIndex(o => !o.disabled));
        break;
      case 'End':
        e.preventDefault();
        for (let i = options.length - 1; i >= 0; i--) {
          if (!options[i].disabled) {
            setFocusedIndex(i);
            break;
          }
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < options.length && !options[focusedIndex].disabled) {
          onChange(options[focusedIndex].value);
          setIsOpen(false);
          triggerRef.current?.focus();
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const popoverVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : -4, scale: shouldReduceMotion ? 1 : 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.15, ease: "easeOut" as any } },
    exit: { opacity: 0, y: shouldReduceMotion ? 0 : -4, scale: shouldReduceMotion ? 1 : 0.98, transition: { duration: 0.1, ease: "easeIn" as any } }
  };

  return (
    <div 
      className={`invictus-select-container ${className}`} 
      ref={containerRef}
      style={style}
      onKeyDown={handleKeyDown}
    >
      {label && (
        <label className="invictus-select-label">
          {label}
        </label>
      )}
      <button 
        type="button"
        className={`invictus-select-trigger ${disabled ? 'disabled' : ''} ${isOpen ? 'open' : ''}`} 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        ref={triggerRef}
        disabled={disabled}
      >
        <span>{displayText}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
        </motion.div>
      </button>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && coords && (
            <motion.div 
              className="invictus-select-popover" 
              role="listbox"
              variants={popoverVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              ref={popoverRef}
              style={{
                position: 'fixed',
                top: coords.top,
                left: coords.left,
                width: coords.width,
                maxHeight: Math.min(300, coords.bottom - 10) // 10px padding from screen edge
              }}
            >
              {options.length === 0 && (
                <div className="invictus-select-empty">No options</div>
              )}
              {options.map((option, index) => (
                <div 
                  key={option.value}
                  className={`invictus-select-option ${index === focusedIndex ? 'focused' : ''} ${option.disabled ? 'disabled' : ''}`}
                  role="option"
                  aria-selected={value === option.value}
                  onMouseEnter={() => {
                    if (!option.disabled) setFocusedIndex(index);
                  }}
                  onClick={() => {
                    if (!option.disabled) {
                      onChange(option.value);
                      setIsOpen(false);
                      triggerRef.current?.focus();
                    }
                  }}
                >
                  {option.label}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
