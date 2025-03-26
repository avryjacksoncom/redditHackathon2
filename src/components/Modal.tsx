import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  // Inline styles for modal components
  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalContentStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    position: 'relative',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '80vh',  // Max height of the modal content
    overflowY: 'auto',  // Allow vertical scrolling if content exceeds the max height
  };

  const modalCloseButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color:'black'
  };


  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div style={modalOverlayStyle} onClick={handleOutsideClick}>
      <div style={modalContentStyle}>
        <button style={modalCloseButtonStyle} onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
