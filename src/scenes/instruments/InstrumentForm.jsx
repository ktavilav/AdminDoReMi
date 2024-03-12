// InstrumentForm.js
import React, { useState, useEffect } from 'react';

import { Box, Button, TextField, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Formik, FieldArray } from 'formik';
import * as yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from '../../components/Header';

const InstrumentForm = ({ onSubmit, instrumento, onCancel }) => {
  const isNonMobile = useMediaQuery('(min-width:600px)');
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [showImageDialog, setShowImageDialog] = useState(false);


  const [categories, setCategories] = useState([]);
  const [instrumentDescription, setInstrumentDescription] = useState('');

  const resetFormValues = (setFieldValue) => {
    setFieldValue('imagen', []);
  };
  
  useEffect(() => {
    // Obtener la lista de categorías del backend al montar el componente
    const fetchCategories = async () => {
      try {
        const response = await fetch('/categoria/listar');
        if (!response.ok) {
          throw new Error('Error al obtener la lista de categorías');
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error:', error);
        // Manejar el error según tus necesidades
      }
    };

    fetchCategories();
  }, []);  

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
      <Header title={`${instrumento ? 'EDITAR' : 'AGREGAR'} INSTRUMENTO`} subtitle={`${instrumento ? 'Editar un' : 'Agregar un nuevo'} Instrumento`} />

      <Formik
        onSubmit={(values, actions) => {
          onSubmit(values);
          resetFormValues(actions.setFieldValue);
          actions.resetForm();
        }}
        initialValues={instrumento ? { ...instrumento } : initialValues}
        validationSchema={instrumentSchema}
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
                {instrumento ? 'Guardar Cambios' : 'Agregar Instrumento'}
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
                select
                fullWidth
                variant="filled"
                label="Categoría"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.categoria.categoria_id}
                name="categoria"
                error={!!touched.categoria && !!errors.categoria}
                helperText={touched.categoria && errors.categoria}
                sx={{ gridColumn: 'span 4' }}
              >
                {categories.map((category) => (
                  <option key={category.categoria_id} value={category.categoria_id}>
                    {category.nombre}
                  </option>
                ))}
              </TextField>
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Precio"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.precioDia}
                name="precioDia"
                error={!!touched.precioDia && !!errors.precioDia}
                helperText={touched.precioDia && errors.precioDia}
                sx={{ gridColumn: 'span 4' }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nombre del Instrumento"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nombre}
                name="nombre"
                error={!!touched.nombre && !!errors.nombre}
                helperText={touched.nombre && errors.nombre}
                sx={{ gridColumn: 'span 4' }}
              />

              <TextField
                fullWidth
                variant="filled"
                multiline
                rows={4}
                label="Descripción del Instrumento"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.descripcion}
                name="descripcion"
                error={!!touched.descripcion && !!errors.descripcion}
                helperText={touched.descripcion && errors.descripcion}
                sx={{ gridColumn: 'span 4' }}
              />

              <FieldArray name="images">
                {(arrayHelpers) => (
                  <div>
                    <Typography variant="h6" gutterBottom>
                      Imágenes del Instrumento
                    </Typography>
                    {values.imagen.map((image, index) => (
                      <Box key={index} display="flex" alignItems="center">
                        <TextField
                          fullWidth
                          variant="filled"
                          type="text"
                          label={`URL de la Imagen ${index + 1}`}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            handleChange(e);
                            setFieldValue(`imagen[${index}].url`, e.target.value);
                          }}
                          value={image.url}
                          name={`imagen[${index}].url`}
                          error={!!touched.imagen?.[index]?.url && !!errors.imagen?.[index]?.url}
                          helperText={touched.imagen?.[index]?.url && errors.imagen?.[index]?.url}
                        />
                        <TextField
                          fullWidth
                          variant="filled"
                          type="text"
                          label={`Título de la Imagen ${index + 1}`}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            handleChange(e);
                            setFieldValue(`imagen[${index}].title`, e.target.value);
                          }}
                          value={image.title}
                          name={`imagen[${index}].title`}
                          error={!!touched.imagen?.[index]?.title && !!errors.imagen?.[index]?.title}
                          helperText={touched.imagen?.[index]?.title && errors.imagen?.[index]?.title}
                        />
                        <IconButton
                          color="secondary"
                          onClick={() => handleRemoveImage(arrayHelpers, index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                    {values.imagen.length < 5 && (
                      <Button
                        type="button"
                        color="secondary"
                        onClick={() => arrayHelpers.push({ url: '', title: '' })}
                        startIcon={<PhotoCameraIcon />}
                      >
                        Agregar Imagen
                      </Button>
                    )}
                  </div>
                )}
              </FieldArray>

              {/* Campo para manejar las imágenes */}
              <FieldArray
                name="imagen"
                render={(arrayHelpers) => (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Imágenes del Instrumento
                    </Typography>
                    {values.imagen.map((image, index) => (
                      <Box key={index} display="flex" alignItems="center" mb="10px">
                        <img
                          src={image.url}
                          alt={`Imagen ${index + 1}`}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                          onClick={() => openImageDialog(index)}
                        />
                        <IconButton onClick={() => arrayHelpers.remove(index)} color='secondary'>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                    {values.imagen.length < 5 && (
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
                                arrayHelpers.push({ url: e.target.result, titulo: '' });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <label htmlFor="image-upload">
                          <Button component="span" variant="outlined" color='secondary'>
                            <PhotoCameraIcon color='secondary'/>
                            Agregar Imagen
                          </Button>
                        </label>
                      </Box>
                    )}
                  </Box>
                )}
              />
              <Box>
                {/* Muestra las imágenes */}
                {values.imagen &&
                  values.imagen.map((imagen, index) => (
                    <div key={index}>
                      <img
                        src={imagen.url}
                        alt={`Imagen ${index + 1}`}
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                      {/* Botón para eliminar la imagen */}
                      <Button onClick={() => handleRemoveImage(index)} color='secondary'>
                        Eliminar
                      </Button>
                    </div>
                  ))}
              </Box>
            </Box>

          </form>
        )}
      </Formik>

      {/* Diálogo para mostrar la imagen seleccionada */}
      {/* 
      <Dialog open={showImageDialog} onClose={closeImageDialog}>
        <DialogTitle>Imagen del Instrumento</DialogTitle>
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

const instrumentSchema = yup.object().shape({
  nombre: yup.string().required('El nombre del instrumento es requerido'),
  imagen: yup.array().max(5, 'No se pueden agregar más de 5 imágenes'),
  // Otras validaciones según sea necesario
});

const initialValues = {
  nombre: '',
  imagen: [],
};

export default InstrumentForm;
