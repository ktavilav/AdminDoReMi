import React from 'react';
import './css/PositiveBody.css';

function ReservationConfirm() {
  return (
    <div className="body-container">
      <img 
        src={process.env.PUBLIC_URL + '/images/confirm.png'}
        alt="Reserva Confirmada" className="confirmation-image" 
      />
      <div className="confirmation-info">
        <h2 className="confirmation-title">¡Reserva Confirmada!</h2>
        <p className="confirmation-message">
          <strong>¡Gracias por elegir Doremi para rentar tu instrumento!</strong> 
          Tu reserva ha sido confirmada y estamos emocionados de proporcionarte el instrumento musical que necesitas. 
          En Doremi, nos esforzamos por brindar un servicio excepcional y garantizar que tengas una experiencia musical sin problemas. 
          Si tienes alguna pregunta o necesitas asistencia adicional, no dudes en ponerte en contacto con nuestro equipo de soporte. 
          ¡Prepárate para hacer música y deja que Doremi sea tu compañero en cada nota! ¡Gracias de nuevo por confiar en nosotros!
        </p>
      </div>
    </div>
  );
}

export default ReservationConfirm;