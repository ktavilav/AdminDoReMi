import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar'; 

import { useAuth } from '../AuthContext';
import './css/Header.css';

const HeaderHome = () => {
  const { isLogged, userId, logout } = useAuth(); 
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  const getUserName = () => {
    return userName || ''; 
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');

        console.log("Verificando datos login-->", userId);
        console.log("Verificando datos token-->", token);
        console.log("Verificando datos isLogged-->", isLogged);
        const userResponse = await fetch(`/usuario/buscarPorId/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserName(`${userData.nombre} ${userData.apellido}`);
          setUserRole(userData.role);
        } else {
          throw new Error('Error al obtener los datos del usuario');
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    };

    if (isLogged) {
      fetchUserData();
    }
  }, [isLogged]);

  const handleProfileClick = () => {
    // Redirige a la página de perfil
    window.location.href = '/homeprofile';
  };

  const handleLogout = () => {
    // Pregunta al usuario si está seguro de cerrar sesión
    const confirmLogout = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
    if (confirmLogout) {
      // Realiza el cierre de sesión si el usuario confirma
      logout();
    }
  };
  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/">
          <img
            src={process.env.PUBLIC_URL + '/images/logo.png'}
            alt="Logo"
            className="logo"
          />
        </Link>
      </div>
      <div className="buttons-container">
        {isLogged ? (
          <>
            <span>Bienvenida {getUserName()}</span>
            <Avatar style={{ cursor: 'pointer' }} onClick={handleProfileClick}  name={getUserName()} size="40" round={true} className='avatar' />
            <button onClick={handleLogout}>Cerrar sesión</button>
            {userRole === 'ADMIN' && (
              <Link to="/admin">
                <button>Admin Panel</button>
              </Link>
            )}
          </>
        ) : (
          <>
            <Link to="/login">
              <button>Iniciar sesión</button>
            </Link>
            <Link to="/register">
              <button>Crear cuenta</button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default HeaderHome;
