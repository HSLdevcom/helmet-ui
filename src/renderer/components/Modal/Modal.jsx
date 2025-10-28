import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, onSubmit, title, children }) => {
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
        <div className="Modal__body">{children}</div>
        <div className="Modal__footer">
          <button className="Modal__button" onClick={onClose}>
            Peruuta
          </button>
          <button className="Modal__button Modal__button--primary" onClick={onSubmit}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
