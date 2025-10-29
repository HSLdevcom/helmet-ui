import React, { useEffect, useCallback } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, onSubmit, title, children }) => {
  // Pressing Enter should trigger "OK"
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // prevent accidental form submits or newlines
        onSubmit();
      } else if (e.key === 'Escape') {
        onClose(); // optional: allow closing with ESC too
      }
    },
    [onSubmit, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="Modal__overlay">
      <div className="Modal">
        <div className="Modal__header">
          <h2>{title}</h2>
          <button className="Modal__close" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="Modal__body">{children}</div>
          <div className="Modal__footer">
            <button type="button" className="Modal__button" onClick={onClose}>
              Peruuta
            </button>
            <button type="submit"
              className="Modal__button Modal__button--primary"
              onClick={onSubmit}
            >
              OK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
