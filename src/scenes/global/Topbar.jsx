import { Box, IconButton, useTheme,  Button} from "@mui/material";
import React, { useContext, useState, useEffect } from 'react';

import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LogoutIcon from '@mui/icons-material/Logout';

import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
//import SearchIcon from "@mui/icons-material/Search";

const Topbar = ({ isLoggedIn, onLogout }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [userName, setUserName] = useState('');

  const handleLogout = () => {
    const confirmLogout = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
    if (confirmLogout) {
      onLogout(); 
    }
  };

  const getUserName = () => {
    return userName || ''; 
  };

  const fetchUserName = async () => {
    try {
      const response = await fetch(`/usuario/buscarPorId/${localStorage.getItem('userId')}`);
      if (!response.ok) {
        throw new Error('Error al obtener los datos del usuario');
      }
      const userData = await response.json();
      setUserName(`${userData.nombre} ${userData.apellido}`);
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  };  

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserName();
    }
  }, [isLoggedIn]);

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        {/* <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          {/* <SearchIcon /> */}
        {/* </IconButton> */}
      </Box>

      {/* ICONS */}
      <Box display="flex">

        <PersonOutlinedIcon /><span>Bienvenida {getUserName()}</span>

        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton onClick={handleLogout}>
          {isLoggedIn && (
            <LogoutIcon variant="contained" color="secondary"/>
          )}
        </IconButton>
        {/* 
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton>
          <PersonOutlinedIcon />
        </IconButton>
        */}
      </Box>
    </Box>
  );
};

export default Topbar;
