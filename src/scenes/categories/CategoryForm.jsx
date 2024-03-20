// CategoryForm.js
import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, IconButton } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';

import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from '../../components/Header';

const CategoryForm = ({ onSubmit, categoria, onCancel }) => {
    const isNonMobile = useMediaQuery('(min-width:600px)');
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [showImageDialog, setShowImageDialog] = useState(false);
    const isCreatingNewCategory = !categoria; 

    const resetFormValues = (setFieldValue) => {
        setFieldValue('imagen', []);
    };

/*
Esto va en el form de categoria
  const createCategory = async (newCategory) => {
    try {
      // Lógica para crear una nueva categoría en el backend
    
      // Después de crear la categoría, actualizar categorías en localStorage
      const updatedCategories = [...categories, newCategory];
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
      // También es posible que quieras volver a llamar a fetchCategories para asegurarte de tener los datos actualizados
    } catch (error) {
      console.error('Error:', error);
    }
  };

// Al crear una nueva categoría en el servidor
const createCategory = async (newCategory) => {
  try {
    const response = await fetch('/categoria/crear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCategory),
    });
    if (!response.ok) {
      throw new Error('Error al crear la categoría');
    }

    // Obtener las categorías actualizadas del servidor
    fetchCategories();
  } catch (error) {
    console.error('Error:', error);
  }
};  
*/

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
        <Header title={`${categoria ? 'EDITAR' : 'AGREGAR'} CATEGORÍA`} subtitle={`${categoria ? 'Editar una' : 'Agregar una nueva'} Categoría`} />

        <Formik
            onSubmit={(values, actions) => {
                onSubmit(values, actions);
                resetFormValues(actions.setFieldValue);
                actions.resetForm();
            }}
            initialValues={{ ...initialValues, ...categoria }}
            validationSchema={categorySchema}
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
                    {categoria ? 'Guardar Cambios' : 'Agregar Categoría'}
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
                        type="text"
                        label="Nombre de la categoría"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.nombre}
                        name="nombre"
                        error={!!touched.nombre && !!errors.nombre}
                        helperText={touched.nombre && errors.nombre}
                        sx={{ gridColumn: 'span 4' }}
                    />

                        <div>
                            <Typography variant="h6" gutterBottom>
                            Imágen de la Categoría
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
                            Imágenes de la Categoría
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
            <DialogTitle>Imagen de la Categoría</DialogTitle>
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

const categorySchema = yup.object().shape({
    nombre: yup.string().required('El nombre del categoria es requerido'),
    imagen: yup.string().required('La URL de la imagen es requerida'),
});

const initialValues = {
    nombre: '',
    imagen: '',
};

const getInitialValues = (categoria) => {
  return {
    nombre: categoria ? categoria.nombre : '',
    imagen: categoria ? categoria.imagen : '',
  };
};

export default CategoryForm;