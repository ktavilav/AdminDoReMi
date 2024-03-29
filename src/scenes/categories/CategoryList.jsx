import React, { useState, useEffect } from 'react';
import { tokens } from "../../theme";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, useTheme } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import CategoryForm from './CategoryForm';
import NoImageSVG from '../../components/NoImageSVG';
import { Token } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CategoryList = ({ showSnackbar, token }) => {
  const theme = useTheme(); 
  const colors = tokens(theme.palette.mode);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDataGrid, setShowDataGrid] = useState(true);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [cloudinaryImageUrls, setCloudinaryImageUrls] = useState([]);

  const [confirmationInput, setConfirmationInput] = useState('');
  const [isConfirmationValid, setIsConfirmationValid] = useState(false);


  const fetchData = async () => {
    try {
      console.log('token---->',token);
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
      const categoriaConId = data.map((categoria, index) => ({
        ...categoria,
        id: index + 1,
      }));

      setCategories(categoriaConId);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleSubmitCategory = async (values, actions) => {
    const updatedValues = { ...values };
    const newImage = selectedCategory && !selectedCategory.imagen ? null : values.imagen;

    try {
      let imageUrl = '';

        if (newImage && !newImage.startsWith('http')) {
          console.log('INSIDE', newImage);
            imageUrl = await handleUploadImage(newImage);
        } else if (newImage) {
            imageUrl = newImage;
        }

        if (imageUrl) {
            setCloudinaryImageUrls([imageUrl]);
        }

        const valuesToSend = { ...updatedValues };
        valuesToSend.imagen = imageUrl;

        selectedCategory ? handleUpdateCategory(valuesToSend) : handleAddCategory(valuesToSend);

        setSelectedCategory(null);
        setShowForm(false);
        setShowDataGrid(true);

        actions.resetForm();
    } catch (error) {
        showSnackbar(error.message);
      console.error('Error:', error);
    }
  }

  const handleAddCategory = async (values) => {
    try {
      const response = await fetch('/categoria/agregar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el categoría');
      }
      showSnackbar('Categoría creada exitosamente');

      fetchData();
      setShowForm(false);
    } catch (error) {
      showSnackbar(error.message);
      console.error('Error:', error);
    }
  };

  const handleUpdateCategory = async (values) => {
    try {
      const response = await fetch('/categoria/modificar', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el categoría');
      }
      showSnackbar('Categoría actualizada exitosamente');

      fetchData();
    } catch (error) {
      showSnackbar(error.message);
      console.error('Error:', error);
    }
  };

  const handleEditCategory = (categoria) => {
    setSelectedCategory(categoria);
    setShowDataGrid(false);
    setShowForm(true);
  };

  const handleDeleteCategory = async () => {
    if (confirmationInput === 'Aceptar') {
      try {
        if (!selectedCategory) {
          console.error('No hay categoría seleccionada para eliminar');
          return;
        }

        const response = await fetch(`/categoria/eliminar/${selectedCategory.categoria_id}`, {
          method: 'DELETE',
          headers: {
              'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el categoría');
        }
        showSnackbar('Categoría eliminada exitosamente');

        fetchData();
      } catch (error) {
        showSnackbar(error.message);
        console.error('Error:', error);
      }
      setConfirmDelete(false);
    }
  };  


  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setConfirmationInput(inputValue);
    setIsConfirmationValid(inputValue === 'Aceptar');
  };

  const handleUploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');
      const response = await fetch('https://api.cloudinary.com/v1_1/djgwbcthz/image/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al cargar la imagen en Cloudinary');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      showSnackbar(error.message);
      console.error('Error:', error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    {
      field: 'imagen',
      headerName: 'Imagen',
      flex: 1,
      renderCell: (params) => (
          <div>
          {params.row.imagen.length > 0 && (
            <img
                src={params.row.imagen.length > 0 ? params.row.imagen : ''}
                alt={params.row.nombre}
                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
            />
          )}
          {params.row.imagen.length === 0 && (
            <NoImageSVG/>
          )}
        </div>
      ),
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      flex: 1,
      renderCell: (params) => (
        <div>
        <Button onClick={() => {handleEditCategory(params.row)}} color="secondary" startIcon={<EditIcon />}>
        </Button>
        <Button onClick={() => {setConfirmDelete(true); setSelectedCategory(params.row);}} color="error" startIcon={<DeleteIcon />}>
        </Button>
      </div>
      ),
    },
  ];

  const getRowId = (row) => row.id;

  return (
    <Box m="20px" height="500px">
        <Typography variant="h5" gutterBottom>
          Gestionar Categorías
        </Typography>

      {showDataGrid && (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setSelectedCategory(null);
            setShowForm(true);
            setShowDataGrid(false);
          }}
          sx={{ marginBottom: '20px' }}
        >
          Agregar Categoría
        </Button>
      )}

      {showForm && (
        <CategoryForm
          onSubmit={handleSubmitCategory}
          initialValues={selectedCategory || {}}
          categoria={selectedCategory}
          onCancel={() =>{setShowForm(false); setShowDataGrid(true)} }
        />          
      )}

      {showDataGrid && (
        <DataGrid
          rows={categories}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          getRowId={getRowId}
        />
      )}
      {/* Confirmación antes de eliminar */}
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar esta categoría? Esta acción eliminará todos los productos de esta categoría.
          </Typography>
          <TextField
            label="Confirmar acción escribiendo 'Aceptar'"
            fullWidth
            variant="filled"
            value={confirmationInput}
            onChange={handleInputChange}
            error={!isConfirmationValid}
            helperText={!isConfirmationValid && 'Por favor, escribe la palabra Aceptar'}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteCategory} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryList;
