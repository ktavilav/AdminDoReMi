import React from 'react';
import { Box, Typography, Button, IconButton, useTheme } from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import EmailIcon from '@mui/icons-material/Email';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TrafficIcon from '@mui/icons-material/Traffic';
import Header from '../../components/Header';
import LineChart from '../../components/LineChart';
import GeographyChart from '../../components/GeographyChart';
import BarChart from '../../components/BarChart';
import StatBox from '../../components/StatBox';
import ProgressCircle from '../../components/ProgressCircle';
import { tokens } from '../../theme';

const Dashboard = () => {
  const theme = useTheme(); 

  return (
    <Box>
      <Header title="Dashboard" />

      {/* Contenido del Dashboard */}
      <Box>
        <Typography variant="h4">Bienvenido al panel de control</Typography>
        <Typography>
          Aquí encontrarás información clave sobre tu negocio de alquiler de instrumentos musicales.
        </Typography>

        {/* Estadísticas */}
        <Box>
          <Typography variant="h5">Estadísticas</Typography>
          <StatBox label="Total de instrumentos en inventario" value="50" />
          <StatBox label="Instrumentos alquilados" value="20" />
          <StatBox label="Ingresos totales del mes" value="$5000" />
        </Box>

      </Box>
    </Box>
  );
};

export default Dashboard;
