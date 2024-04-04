import React from 'react';
import Avatar from 'react-avatar'; // Importa el componente Avatar de react-avatar
import './css/NewHeader.css';

function NewHeader() {
  // Función para obtener el nombre de usuario desde el almacenamiento local
  const getUserName = () => {
    return localStorage.getItem('userName') || ''; // Si el nombre de usuario no está definido, devuelve una cadena vacía
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    const confirmLogout = window.confirm('¿Estás seguro que quieres cerrar sesión?');
    if (confirmLogout) {
      localStorage.removeItem('userName'); // Elimina el nombre de usuario del almacenamiento local al cerrar sesión
      window.location.href = '/'; // Redirige al usuario a otra página después de cerrar sesión
    }
  };
  const handleProfileClick = () => {
    // Redirige a la página de perfil
    window.location.href = '/perfil';
  };

  return (
    <header>
      <div className="logo">
        <img src="images/logo.png" alt="logo" />
      </div>
      <div className="user-info">
        {/* Mostramos el nombre del usuario */}
        <span>{getUserName()}</span>
        {/* Mostramos el avatar del usuario utilizando el componente Avatar de react-avatar */}
        <Avatar name={getUserName()} size="40" round={true} className='avatar' />
        {/* Botón de cerrar sesión con confirmación */}
        <button onClick={handleLogout} className='logout'>Cerrar sesión</button>
        <button onClick={handleProfileClick} className='profile'> Mi Perfil</button>
      </div>
    </header>
  );
}

export default NewHeader;