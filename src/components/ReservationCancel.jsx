import React from 'react';
import './css/NegativeBody.css';

function ReservationCancel() {
  return (
    <div className="body-container">
      <img 
        src={process.env.PUBLIC_URL + '/images/cancel.png'}
        alt="Reserva Cancelada" className="cancelation-image" 
      />
      <div className="cancelation-info">
        <h2 className="cancelation-title">¡Reserva Cancelada!</h2>
        <p className="cancelation-message">
          <strong>Lo sentimos, tu reserva no pudo completarse en este momento. </strong> 
          Esto puede deberse a que el producto ya ha sido reservado o ha habido un error con los datos proporcionados. 
          Por favor, revisa la disponibilidad del producto y asegúrate de que tus datos estén correctos. 
          Para más ayuda, contáctanos. Gracias por tu comprensión.
        </p>
      </div>
    </div>
  );
}

export default ReservationCancel;