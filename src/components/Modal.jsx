import React from 'react';
import '../components/css/Modal.css'; // Asegúrate de importar los estilos del modal si los tienes

const Modal = ({ mostrar, onClose, children }) => {
  return (
    <>
      {mostrar && (
        <div className="modal-overlay">
          <div className="modal">
          <button className="modal-cerrar" onClick={onClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="peru"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="modal-contenido">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
