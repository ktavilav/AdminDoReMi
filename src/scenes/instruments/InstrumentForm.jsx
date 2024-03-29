// InstrumentForm.js
import React, { useState, useEffect } from 'react';
import { Image } from 'cloudinary-react';

import { Box, Button, TextField, Typography, IconButton, InputLabel } from '@mui/material';
import { Formik, FieldArray } from 'formik';
import * as yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from '../../components/Header';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { grey } from '@mui/material/colors';
import { CardFooter } from 'react-bootstrap';

let categoriasCargadas = false;
let categoriaSeleccionada = '';

const InstrumentForm = ({ onSubmit, instrumento, onCancel, token }) => {
  const isNonMobile = useMediaQuery('(min-width:600px)');
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [showImageDialog, setShowImageDialog] = useState(false);

  const [categories, setCategories] = useState([]);
  const [instrumentDescription, setInstrumentDescription] = useState('');
  const isCreatingNewInstrument = !instrumento;

  if (instrumento && instrumento.categoria && instrumento.categoria.categoria_id) {
    categoriaSeleccionada = instrumento.categoria.categoria_id;
  }  
  const resetFormValues = (setFieldValue) => {
    setFieldValue('imagen', []);
  };
  useEffect(() => {
    const storedCategories = localStorage.getItem('categories');
    
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
      categoriasCargadas = true;
    } else {
      fetchCategories();
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/categoria/listar', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }      
      );
      if (!response.ok) {
        throw new Error('Error al obtener la lista de categorías');
      }

      const data = await response.json();
      localStorage.setItem('categories', JSON.stringify(data));
      setCategories(data);
    } catch (error) {
      console.error('Error:', error);
    }
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


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/categoria/listar');
        if (!response.ok) {
          throw new Error('Error al obtener la lista de categorías');
        }

        const data = await response.json();
        setCategories(data);
        categoriasCargadas = true;
      } catch (error) {
        console.error('Error:', error);
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

  if (!categoriasCargadas) {
    return <Typography variant="h6">Cargando categorías...</Typography>;
  }

  return (
    <Box m="20px">
      <Header title={`${instrumento ? 'EDITAR' : 'AGREGAR'} INSTRUMENTO`} subtitle={`${instrumento ? 'Editar un' : 'Agregar un nuevo'} Instrumento`} />

      <Formik
        onSubmit={(values, actions) => {
          onSubmit(values, actions);
          resetFormValues(actions.setFieldValue);
          actions.resetForm();
        }}
        initialValues={{ ...initialValues, ...instrumento }}
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
              <FormControl fullWidth sx={{ gridColumn: 'span 4' }}>
                <InputLabel id="categoria-label" style={{ marginTop: '15px' }}>Categoría</InputLabel>
                <Select
                  fullWidth
                  variant="filled"
                  label="Categoría"
                  placeholder='Categoría'
                  onBlur={handleBlur}
                  onChange={(e) => {
                    const selectedCategoryId = e.target.value;
                    handleChange({
                      target: {
                        name: 'categoria',
                        value: selectedCategoryId || '',
                      }
                    });
                  }}
                  value={values.categoria.categoria_id || values.categoria}
                  name="categoria"
                  error={!!touched.categoria && !!errors.categoria}
                  sx={{ backgroundColor: grey }}
                  inputProps={{
                    placeholder: 'Categoría',
                  }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.categoria_id} value={category.categoria_id}>
                      {category.nombre}
                    </MenuItem>
                  ))}
                </Select>
                              
              </FormControl>

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
                          name={`imagen[${index}].titulo`}
                          error={!!touched.imagen?.[index]?.title && !!errors.imagen?.[index]?.title}
                          helperText={touched.imagen?.[index]?.title && errors.imagen?.[index]?.title}
                        />
                      </Box>
                    ))}
                   
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
              {/* Muestra las imágenes */}
              <Box>
                {values.imagen &&
                  values.imagen.map((imagen, index) => (
                    <div key={index}>
                      <img
                        src={imagen.url}
                        alt={`Imagen ${index + 1}`}
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
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
  precioDia: yup.number().positive('El precio debe ser mayor que cero').required('El precio es requerido'),
  /*categoria: yup.number().when([], {
    is: () => categoriasCargadas,
    then: yup.number().positive('La categoría es requerida'),
    otherwise: yup.number()
  }),*/
  descripcion: yup.string().required('La descripción es requerida'),
  imagen: yup.array().max(5, 'No se pueden agregar más de 5 imágenes').of(
    yup.object().shape({
      url: yup.string().required('La URL de la imagen es requerida'),
      titulo: yup.string().required('El título de la imagen es requerido')
    })
  )
});


const initialValues = {
  nombre: '',
  imagen: [],
  categoria: categoriaSeleccionada,
  precioDia: '',
  descripcion: '',
};

const getInitialValues = (instrumento) => {
  return {
    nombre: instrumento ? instrumento.nombre : '',
    imagen: instrumento ? instrumento.imagen : [],
    categoria: categoriaSeleccionada,
    precioDia: instrumento ? instrumento.precioDia : '',
    descripcion: instrumento ? instrumento.descripcion : '',
  };
};


export default InstrumentForm;