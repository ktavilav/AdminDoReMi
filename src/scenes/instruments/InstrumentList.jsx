  import React, { useState, useEffect } from 'react';
  import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
  import { DataGrid, GridToolbar } from '@mui/x-data-grid';
  import { useTheme } from '@mui/material';
  import { tokens } from "../../theme";

  import InstrumentForm from './InstrumentForm';
  import NoImageSVG from '../../components/NoImageSVG';
  import EditIcon from '@mui/icons-material/Edit';
  import DeleteIcon from '@mui/icons-material/Delete';

  const InstrumentList = ({ showSnackbar, token }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [instrumentos, setInstrumentos] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showDataGrid, setShowDataGrid] = useState(true);
    const [selectedInstrument, setSelectedInstrument] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [cloudinaryImageUrls, setCloudinaryImageUrls] = useState([]);

    const fetchData = async () => {
      try {
        console.log('token---->',token);
        const response = await fetch('/instrumentos/listar', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }      
        );
        if (!response.ok) {
          throw new Error('Error al obtener la lista de instrumentos');
        }

        const data = await response.json();
        const instrumentosConId = data.map((instrumento, index) => ({
          ...instrumento,
          id: index + 1,
        }));

        setInstrumentos(instrumentosConId);
      } catch (error) {
        showSnackbar(error.message);
        console.error('Error:', error);
      }
    };

    useEffect(() => {
      fetchData();
    }, [token]);

    const handleSubmitInstrument = async (values, actions) => {
      const updatedValues = { ...values };
console.log('updatedValues====------->',updatedValues);
      const newImages = values.imagen.filter(image => {
        if (selectedInstrument) {
          return !selectedInstrument.imagen.some(oldImage => oldImage.url === image.url);
        }
        return true;
      });


      updatedValues.imagen = newImages;

      try {
        const imageUrls = await Promise.all(updatedValues.imagen.map(async (image) => {
          if (!image.url.startsWith('http')) {
            return await handleUploadImage(image.url);
          }
          return image.url;
        }));

        setCloudinaryImageUrls(imageUrls);

        const valuesToSend = { ...updatedValues };
        valuesToSend.imagen = updatedValues.imagen.map((image, index) => ({
          url: imageUrls[index], 
          titulo: image.titulo 
        }));

        valuesToSend.categoria = typeof values.categoria === 'number' ? values.categoria : values.categoria.categoria_id;
console.log('valuesToSend====------->',valuesToSend);
        selectedInstrument  ? handleUpdateInstrument(valuesToSend) : handleAddInstrument(valuesToSend);

        setSelectedInstrument(null);
        setShowForm(false); 
        setShowDataGrid(true);

        actions.resetForm();
      } catch (error) {
        showSnackbar(error.message);
        console.error('Error:', error);
      }
    }

    const handleAddInstrument = async (values) => {
      try {
        const response = await fetch('/instrumentos/agregar', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Error al agregar el instrumento');
        }
      showSnackbar('Instrumento creado exitosamente');

        fetchData();
        setShowForm(false);
      } catch (error) {
        showSnackbar(error.message);
        console.error('Error:', error);
      }
    };

    const handleUpdateInstrument = async (values) => {
      try {
        const response = await fetch('/instrumentos/modificar', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar el instrumento');
        }
        showSnackbar('Instrumento actualizado exitosamente');

        fetchData();
      } catch (error) {
        showSnackbar(error.message);
        console.error('Error:', error);
      }
    };

    const handleEditInstrument = (instrumento) => {
      setSelectedInstrument(instrumento);
      setShowForm(true);
      setShowDataGrid(false);
    };

  const handleDeleteInstrument = async () => {
    try {
      console.log('selectedInstrument--->',selectedInstrument);
      if (!selectedInstrument) {
        console.error('No hay instrumento seleccionado para eliminar');
        return;
      }

      const response = await fetch(`/instrumentos/eliminar/${selectedInstrument.instrumento_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el instrumento');
      }

      showSnackbar('Instrumento eliminado exitosamente');

      fetchData();
      setConfirmDelete(false);
    } catch (error) {
      showSnackbar(error.message);
      console.error('Error:', error);
    }
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
      { 
        field: 'categoria', 
        headerName: 'Categoría', 
        flex: 1,
        valueGetter: (params) => params.row.categoria.nombre
      },
      { field: 'nombre', headerName: 'Nombre', flex: 1, cellClassName: "name-column--cell" },
      { field: 'precio', headerName: 'Precio', flex: 1 }, 
      {
        field: 'imagen',
        headerName: 'Imagen',
        flex: 1,
        renderCell: (params) => (
            <div>
            {params.row.imagen.length > 0 && (
              <img
                src={params.row.imagen.length > 0 ? params.row.imagen[0].url : ''}
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
            <Button onClick={() => {handleEditInstrument(params.row)}} color="secondary" startIcon={<EditIcon />}>
            </Button>
            <Button onClick={() => {setConfirmDelete(true); setSelectedInstrument(params.row);}} color="error" startIcon={<DeleteIcon />}>
            </Button>
          </div>
        ),
      },
    ];

    const getRowId = (row) => row.id;

    return (
      <Box m="20px" height="500px">
          <Typography variant="h5" gutterBottom>
            Gestionar Instrumentos
          </Typography>
        {showDataGrid && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setSelectedInstrument(null);
              setShowForm(true);
              setShowDataGrid(false);
            }}
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .name-column--cell": {
                color: colors.greenAccent[300],
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.blueAccent[700],
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.primary[400],
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: colors.blueAccent[700],
              },
              "& .MuiCheckbox-root": {
                color: `${colors.greenAccent[200]} !important`,
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `${colors.grey[100]} !important`,
              },
            }}
          >
            Agregar Instrumento
          </Button>
        )}

        {showForm && (
          <InstrumentForm
            onSubmit={handleSubmitInstrument}
            initialValues={selectedInstrument || {}}
            instrumento={selectedInstrument}
            onCancel={() =>{setShowForm(false); setShowDataGrid(true)} }
            token={token}
          />          
        )}

        {showDataGrid && (
          <DataGrid
            rows={instrumentos}
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
              ¿Estás seguro de que deseas eliminar este instrumento?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDelete(false)} color="secondary">
              Cancelar
            </Button>
            <Button onClick={handleDeleteInstrument} color="error">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  export default InstrumentList;
