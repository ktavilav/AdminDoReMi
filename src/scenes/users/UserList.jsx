import React, { useState, useEffect } from 'react';
import { tokens } from "../../theme";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, useTheme } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import UserForm from './UserForm';
import NoImageSVG from '../../components/NoImageSVG';
import { Token } from '@mui/icons-material';

const UserList = ({ showSnackbar, token }) => {
  const theme = useTheme(); 
  const colors = tokens(theme.palette.mode);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDataGrid, setShowDataGrid] = useState(true);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [cloudinaryImageUrls, setCloudinaryImageUrls] = useState([]);

  const [confirmationInput, setConfirmationInput] = useState('');
  const [isConfirmationValid, setIsConfirmationValid] = useState(false);


  const fetchData = async () => {
    try {
      console.log('token---->',token);
      const response = await fetch('/usuario/listar', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }      
      );
      if (!response.ok) {
        throw new Error('Error al obtener la lista de usuarios');
      }

      const data = await response.json();
      const userConId = data.map((user, index) => ({
        ...user,
        id: index + 1,
      }));

      setUsers(userConId);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleSubmitUser = async (values, actions) => {
    const updatedValues = { ...values };
    const newImage = selectedUser && !selectedUser.imagen ? null : values.imagen;

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

        selectedUser ? handleUpdateUser(valuesToSend) : handleAddUser(valuesToSend);

        setSelectedUser(null);
        setShowForm(false);
        setShowDataGrid(true);

        actions.resetForm();
    } catch (error) {
        showSnackbar(error.message);
      console.error('Error:', error);
    }
  }

  const handleAddUser = async (values) => {
    try {
      const response = await fetch('/usuario/agregar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el USUARIO');
      }
      showSnackbar('Usuario creado exitosamente');

      fetchData();
      setShowForm(false);
    } catch (error) {
      showSnackbar(error.message);
      console.error('Error:', error);
    }
  };

  const handleUpdateUser = async (values) => {
    try {
      const response = await fetch('/usuario/modificar', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el usuario');
      }
      showSnackbar('Usuario actualizado exitosamente');

      fetchData();
    } catch (error) {
      showSnackbar(error.message);
      console.error('Error:', error);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowDataGrid(false);
    setShowForm(true);
  };

  const handleDeleteUser = async () => {
    if (confirmationInput === 'Aceptar') {
      try {
        if (!selectedUser) {
          console.error('No hay usuario seleccionado para eliminar');
          return;
        }

        const response = await fetch(`/usuario/eliminar/${selectedUser.id}`, {
          method: 'DELETE',
          headers: {
              'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el usuario');
        }
        showSnackbar('usuario eliminado exitosamente');

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
    { field: 'username', headerName: 'Username', flex: 1 },
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'apellido', headerName: 'Apellido', flex: 1 },
    { field: 'role', headerName: 'Role', flex: 1 },
    {
      field: 'avatar',
      headerName: 'avatar',
      flex: 1,
      renderCell: (params) => (
          <div>
          {params.row.avatar.length > 0 && (
            <img
                src={params.row.avatar.length > 0 ? params.row.avatar : ''}
                alt={params.row.nombre}
                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
            />
          )}
          {params.row.avatar.length === 0 && (
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
          <Button onClick={() => {handleEditUser(params.row)}} color="secondary">
            Editar
          </Button>
          <Button onClick={() => {setConfirmDelete(true); setSelectedUser(params.row);}} color="error">
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  const getRowId = (row) => row.id;

  return (
    <Box m="20px" height="500px">
        <Typography variant="h5" gutterBottom>
          Gestionar Usuarios
        </Typography>

      {showDataGrid && (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setSelectedUser(null);
            setShowForm(true);
            setShowDataGrid(false);
          }}
          sx={{ marginBottom: '20px' }}
        >
          Agregar Usuario
        </Button>
      )}

      {showForm && (
        <UserForm
          onSubmit={handleSubmitUser}
          initialValues={selectedUser || {}}
          user={selectedUser}
          onCancel={() =>{setShowForm(false); setShowDataGrid(true)} }
        />          
      )}

      {showDataGrid && (
        <DataGrid
          rows={users}
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
            ¿Estás seguro de que deseas eliminar este usuario? Esta acción eliminará todos los productos de esta categoría.
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
          <Button onClick={handleDeleteUser} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserList;
