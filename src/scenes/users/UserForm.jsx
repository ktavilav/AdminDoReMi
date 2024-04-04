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

  return (
    <Box m="20px">
      <Header title={`${user ? 'EDITAR' : 'AGREGAR'} USUARIO`} subtitle={`${user ? 'Editar un' : 'Agregar un nuev'} Usuario`} />

      <Formik
        onSubmit={(values, actions) => {
          onSubmit(values, actions);
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
          </Box>

        </form>
      )}
    </Formik>
    </Box>
  );
};

const userSchema = yup.object().shape({
  username: yup.string().required('Usuario es requerido'),
  role: yup.string().required('Role es requerido'),
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