import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

import './css/Register.css';

const Register = () => {
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    username: '',
    password: ''
  });

  const { login } = useAuth();


  const [confirmationMessage, setConfirmationMessage] = useState('');

  
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('formData-->', formData);
    if (!validateEmail(formData.username)) {
      setConfirmationMessage('El correo electrónico no tiene un formato válido');
      return;
    }

    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setConfirmationMessage('Registro exitoso');
        login();
        const data = await response.json();
        localStorage.setItem('token', data.token);

        const userResponse = await fetch(`/usuario/buscarPorUsername/${formData.username}`, {
          headers: {
            Authorization: `Bearer ${data.token}` 
          }
        });
        const userData = await userResponse.json();
        
        if (userData.role === 'USER') {
          console.log('Inicio de sesión exitoso como usuario');
          localStorage.setItem('userId', userData.usuario_id);
          login();
          navigate('/');
        } else if (userData.role === 'ADMIN') {
          console.log('Inicio de sesión exitoso como administrador');
          localStorage.setItem('userId', userData.usuario_id);
          login();
          navigate('/admin');
        }

        navigate('/');
      } else {
        setConfirmationMessage('Error en el registro');
      }
    } catch (error) {
      console.error('Error al enviar datos al servidor:', error);
      setConfirmationMessage('Error al enviar datos al servidor');
    }
  };

  return (
    <section className="register-container">
      <section className="picture-left">
        <img className='logo-section' src="images/logonuevo.png" alt="logo" />
        <h2 className='title-left'>Tu armonía, nuestra pasión</h2>
      </section>
      <section className="register-right">
        <form className='register-form' onSubmit={handleSubmit}>
          <h3> <strong>Registrarse</strong></h3>
          <div className='input-form'>
            <label className='input' htmlFor="nombre"></label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Nombre"
              required
            />
          </div>
          <div className='input-form'>
            <label className='input' htmlFor="apellido"></label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              placeholder="Apellido"
              required
            />
          </div>
          <div className='input-form'>
            <label className='input' htmlFor="username"></label>
            <input
              type="email"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Correo electrónico"
              required
            />
          </div>
          <div className='input-form'>
            <label className='input' htmlFor="password"></label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Contraseña"
              required
            />
          </div>
          {confirmationMessage && <p>{confirmationMessage}</p>}
          <button className='button-register' type="submit">Registrarse</button>
          <p className='account'>¿Ya tienes cuenta? <a href="/login">Iniciar sesión</a></p>
        </form>
      </section>
    </section>
  );
};

export default Register;