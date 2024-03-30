// UserForm.js
import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, InputLabel } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { grey } from '@mui/material/colors';

import Header from '../../components/Header';

const UserForm = ({ onSubmit, user, onCancel }) => {
  const isNonMobile = useMediaQuery('(min-width:600px)');
  const isCreatingNewUser = !user; 
  const [roles] = useState(['USER', 'ADMIN']); 

  const resetFormValues = (setFieldValue) => {
  };

  return (
    <Box m="20px">
      <Header title={`${user ? 'EDITAR' : 'AGREGAR'} USUARIO`} subtitle={`${user ? 'Editar un' : 'Agregar un nuev'} Usuario`} />

      <Formik
        onSubmit={(values, actions) => {
          onSubmit(values, actions);
          resetFormValues(actions.setFieldValue);
          actions.resetForm();
        }}
        initialValues={{ ...initialValues, ...user }}
        validationSchema={userSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
        <form onSubmit={handleSubmit}>
            <Box display="flex" justifyContent="end" mt="20px">
            <Button onClick={onCancel} color="secondary">
                Volver
            </Button>
            <Button type="submit" color="secondary" variant="contained">
                {isCreatingNewUser ? 'Agregar Usuario' : 'Guardar Cambios' }
            </Button>              
            </Box>

            <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                    "& > div": { gridColumn: isNonMobile ? undefined : 'span 4' },
                }}
            >

              <FormControl fullWidth sx={{ gridColumn: 'span 4' }}>
                <InputLabel id="role-label" style={{ marginTop: '15px' }}>Role</InputLabel>
                <Select
                  fullWidth
                  variant="filled"
                  label="Role"
                  placeholder='Role'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.role}
                  name="role"
                  error={!!touched.role && !!errors.role}
                  sx={{ backgroundColor: grey }}
                  inputProps={{
                    placeholder: 'Role',
                  }}
                >
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
                              
              </FormControl>    

              <TextField
                fullWidth
                variant="filled"
                label="Username"
                name="username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username && errors.username}
                sx={{ gridColumn: 'span 4' }}
              />
{/*
            <TextField
              fullWidth
              variant="filled"
              label="Password"
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: 'span 4' }}
            />

            <TextField
              fullWidth
              variant="filled"
              label="Nombre"
              name="nombre"
              value={values.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.nombre && Boolean(errors.nombre)}
              helperText={touched.nombre && errors.nombre}
              sx={{ gridColumn: 'span 4' }}
            />

            <TextField
              fullWidth
              variant="filled"
              label="Apellido"
              name="apellido"
              value={values.apellido}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.apellido && Boolean(errors.apellido)}
              helperText={touched.apellido && errors.apellido}
              sx={{ gridColumn: 'span 4' }}
            />
*/}
          </Box>

        </form>
      )}
    </Formik>

    {/* Diálogo para mostrar la imagen seleccionada */}
    {/* 
    <Dialog open={showImageDialog} onClose={closeImageDialog}>
        <DialogTitle>Avatar</DialogTitle>
        <DialogContent>
        {selectedImageIndex !== null && (
            <img
            src={values.imagen[selectedImageIndex].url}
            alt={`Imagen ${selectedImageIndex + 1}`}
            style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
            />
        )}
        </DialogContent>
        <DialogActions>
        <Button onClick={closeImageDialog} color="primary">
            Cerrar
        </Button>
        </DialogActions>
    </Dialog>
    */}
    </Box>
  );
};

const userSchema = yup.object().shape({
  username: yup.string().required('Usuario es requerido'),
  password: yup.string().required('Clave es requerida'),
  nombre: yup.string().required('Nombre es requerido'),
  apellido: yup.string().required('Apellido es requerido'),
  role: yup.string().required('Role es requerido'),
  avatar: yup.string().url('Avatar debe tener una URL válida'),
});

const initialValues = {
    nombre: '',
    imagen: '',
};

const getInitialValues = (user) => {
  return {
    nombre: user ? user.nombre : '',
    apellido: user ? user.apellido : '',
    username: user ? user.username : '',
    password: user ? user.password : '',
    role: user ? user.role : '',
    avatar: user ? user.avatar : '',
  };
};

export default UserForm;