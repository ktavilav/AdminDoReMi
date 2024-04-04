import React, { useState, useEffect } from 'react';
import './css/ReservationDetail.css';

const DetalleReserva = ({ product, userId, startDate, endDate, setModalType, onReserve }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/usuario/buscarPorId/${userId}`);
        if (!response.ok) {
          throw new Error('Error al obtener los datos del usuario');
        }
        const userData = await response.json();
        setUserData(userData);
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleConfirm = () => {
    onReserve();
  };

  const handleCancel = () => {
    setModalType('reservationCancel');
  };  

  const differenceInDays = () => {
    const oneDay = 24 * 60 * 60 * 1000; 
    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffDays = Math.round(Math.abs((end - start) / oneDay));
    return diffDays;
  };

  return (
    <div className="tarjeta">
      <h2><strong>Detalle de Reserva</strong></h2>
      <div className="info-container">
        <div className="producto-info">
          <div className="info-item">
            <p><strong>{product.nombre}</strong></p>
            <p>{product.descripcion}</p>
            <p><strong>Precio por día:</strong> ${product.precioDia}</p>
            <p><strong>Reservado:</strong> Desde {startDate} hasta {endDate} ({differenceInDays()} días)</p>
          </div>
        </div>
        <div className="cliente-info">
          <div className="info-item">
            <p><strong>Datos del cliente</strong></p>
            {userData ? (
              <>
                <p><strong>Nombre:</strong> {userData.nombre} {userData.apellido}</p>
                <p><strong>Correo Electrónico:</strong> {userData.username}</p>
              </>
            ) : (
              <p>Cargando datos del usuario...</p>
            )}
          </div>
        </div>
      </div>
      <div className="acciones-container">
        <p><strong>¿Listo para Confirmar tu Reserva?</strong></p>
        <p>Haz clic en el botón "Confirmar Reserva" a continuación para asegurar tu Saxofón alto Selmer AS42 y comenzar tu aventura musical.</p>
        <div className="botones-container">
          <button className="confirmar-btn" onClick={handleConfirm}>Confirmar Reserva</button>
          <button className="cancelar-btn" onClick={handleCancel}>Cancelar</button>
        </div>
        <p className="texto-adicional">¿Necesitas hacer cambios o tienes alguna pregunta antes de confirmar? Si necesitas ayuda adicional no dudes en ponerte en contacto con nuestro equipo de soporte al cliente.</p>
      </div>
    </div>
  );
}

export default DetalleReserva;
