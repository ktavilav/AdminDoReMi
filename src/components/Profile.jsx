import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import Avatar from 'react-avatar';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './css/Profile.css';
import './css/Footer.css';

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [userReservations, setUserReservations] = useState([]);
  const favorites = JSON.parse(localStorage.getItem('favorites'));

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`/usuario/buscarPorId/${userId}`);
        if (!response.ok) {
          throw new Error(`Error al obtener los datos del perfil: ${response.statusText}`);
        }
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error al obtener los datos del perfil:', error);
      }
    };

    const fetchUserReservations = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`/reservas/listar`);
        if (!response.ok) {
          throw new Error(`Error al obtener las reservas: ${response.statusText}`);
        }
        const data = await response.json();
        const userReservations = data.filter(reserva => reserva.usuarioReservaSalidaDto.usuario_id === parseInt(userId));
        setUserReservations(userReservations);
      } catch (error) {
        console.error('Error al obtener las reservas:', error);
      }
    };

    fetchProfileData();
    fetchUserReservations();
  }, []);

  const handleViewInstrumentClick = (instrumentoId) => {
    window.location.href = `/product/${instrumentoId}`;
  };

  return (
    <div className="profile-container">
      <h2>Mi perfil</h2>
      {profileData && ( 
        <div className="profile-info">
          <div className="avatar-container">
            <Avatar name={`${profileData.nombre} ${profileData.apellido}`} size="100" round={true} />
          </div>
          <div className="details-container">
            <p><strong>Nombre de Usuario:</strong> {profileData.username}</p>
            <p><strong>Nombre:</strong> {profileData.nombre}</p>
            <p><strong>Apellido:</strong> {profileData.apellido}</p>
            <p><strong>Rol:</strong> {profileData.role}</p>
          </div>
        </div>
      )}
      <h2>Mis favoritos</h2>
      <div className="favorites-carousel">
        <Carousel showArrows={true}>
          {Object.values(favorites).map(product => (
            <div key={product.instrumento_id}>
              <img src={product.imagen[0].url} alt={product.nombre}
              
              style={{ 
                maxWidth: '40%', 
                height: 'auto',
                marginBottom: '10px',
                aspectRatio: '3/2',
                objectFit: 'contain'
              }} 
              />
              <p>{product.nombre}</p>
            </div>
          ))}
        </Carousel>
      </div>   
      <h2>Mis reservas</h2>
      {userReservations.length === 0 ? (
        <p>No tienes reservas.</p>
      ) : (
        <div className="reservations-list">
          {userReservations.map(reserva => (
            <div key={reserva.idReserva} className="reservation-card">
              <div className="reservation-content">
                <h3>Reserva</h3>
                <p><strong>Instrumento:</strong> {reserva.instrumentoReservaSalidaDto.nombre}</p>
                <p><strong>Fecha de inicio:</strong> {reserva.fechaInicial}</p>
                <p><strong>Fecha de fin:</strong> {reserva.fechaFinal}</p>
              </div>
              <div className="reservation-footer">
                <button className="view-instrument-btn" onClick={() => handleViewInstrumentClick(reserva.instrumentoReservaSalidaDto.instrumento_id)}>Ver instrumento</button>
              </div>
            </div>
          ))}
        </div>
      )}            
    </div>
  );
}
<Footer />

export default Profile;
