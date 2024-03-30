import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    nombre: '',
    avatar: '',
    rol: 'Admin', // Definido como 'Admin' por defecto según el JSON proporcionado
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Lógica para enviar el formulario de registro al servidor
    console.log('Datos del formulario:', formData);
  };

  return (
    <Box>
      <Typography variant="h6">Registro de Usuario</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Nombre de Usuario"
          name="username"
          value={formData.username}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Contraseña"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Correo Electrónico"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="URL del Avatar"
          name="avatar"
          value={formData.avatar}
          onChange={handleChange}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Registrarse
        </Button>
      </form>
    </Box>
  );
};
export { RegisterForm };