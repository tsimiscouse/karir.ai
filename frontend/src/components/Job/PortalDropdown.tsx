'use client'
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';

interface PortalDropdownProps {
  anchorRef: React.RefObject<HTMLElement | null>;
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const PortalDropdown: React.FC<PortalDropdownProps> = ({ anchorRef, show, onClose, children }) => {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (anchorRef.current && show) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [show, anchorRef]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (show && anchorRef.current && !anchorRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [show, onClose, anchorRef]);

  if (typeof window === 'undefined') return null;

  return show && typeof document !== 'undefined'
    ? ReactDOM.createPortal(
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}  // Start from a slightly above position and scaled down
          animate={{ opacity: 1, y: 0, scale: 1 }}    // Move to the original position and scale normally
          exit={{ opacity: 0, y: -10, scale: 0.95 }}  // Exit with a slight upward movement and scale down
          transition={{
            duration: 0.4,                         // Duration for the animation
            ease: [0.68, -0.55, 0.27, 1.55],       // Smooth easing function for a natural feel
          }}
          style={{
            position: 'absolute',
            top: position.top,
            left: position.left,
            width: position.width,
            zIndex: 9999,
            pointerEvents: 'auto',
          }}
          className="bg-white mt-[0.5vw] rounded-xl shadow-xl max-h-[15vw] overflow-y-auto"
        >
          {children}
        </motion.div>,
        document.getElementById('portal-root')!
      )
    : null;
};

export default PortalDropdown;
