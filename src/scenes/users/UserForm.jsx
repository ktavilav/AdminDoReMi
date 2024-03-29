// UserForm.js
import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, IconButton } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';

import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from '../../components/Header';

const UserForm = ({ onSubmit, user, onCancel }) => {
    const isNonMobile = useMediaQuery('(min-width:600px)');
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [showImageDialog, setShowImageDialog] = useState(false);
    const isCreatingNewUser = !user; 

    const resetFormValues = (setFieldValue) => {
        setFieldValue('imagen', []);
    };

    const openImageDialog = (index) => {
        setSelectedImageIndex(index);
        setShowImageDialog(true);
    };

    const closeImageDialog = () => {
        setSelectedImageIndex(null);
        setShowImageDialog(false);
    };

    const handleRemoveImage = (index) => {
        // Lógica para eliminar la imagen en el índice proporcionado
        // Puedes actualizar el estado de Formik aquí si es necesario
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
                    {user ? 'Guardar Cambios' : 'Agregar Usuario'}
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

                  <TextField
                    fullWidth
                    variant="filled"
                    label="Role"
                    name="role"
                    value={values.role}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.role && Boolean(errors.role)}
                    helperText={touched.role && errors.role}
                    sx={{ gridColumn: 'span 4' }}
                  />
                  <div>
                    <Typography variant="h6" gutterBottom>
                    Avatar
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label={`URL de la Imagen`}
                        onBlur={handleBlur}
                        onChange={(e) => {
                            handleChange(e);
                            setFieldValue(`imagen`, e.target.value);
                        }}
                        value={values.imagen}
                        name='imagen'
                        error={!!touched.imagen && !!errors.imagen}
                        helperText={touched.imagen && errors.imagen}
                      />
                    </Box>
                  </div>

              {/* Campo para manejar las imágenes */}
                  <Box>
                    <Typography variant="h6" gutterBottom>
                    Avatar
                    </Typography>
                    <Box  display="flex" alignItems="center" mb="10px">
                      <img
                        src={values.imagen}
                        alt='Imagen'
                        style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                        onClick={() => openImageDialog()}
                      />
                      <IconButton color='secondary'>
                      <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Box>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="image-upload"
                        type="file"
                        onChange={(event) => {
                            const file = event.target.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                    setFieldValue('imagen', e.target.result);
                                };
                                reader.readAsDataURL(file);
                            };
                        }}
                      />
                      <label htmlFor="image-upload">
                      <Button component="span" variant="outlined" color='secondary'>
                        <PhotoCameraIcon color='secondary'/>
                        Agregar Imagen
                      </Button>
                      </label>
                    </Box>
                  </Box>
                    {/* Muestra las imágenes */}
                    <Box>
                      {values.imagen && (
                        <div>
                        <img
                            src={values.imagen}
                            alt={`Imagen`}
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                        </div>
                      )}
                    </Box>
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