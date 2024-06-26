
import { Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { CloudinaryContext } from 'cloudinary-react';
import ReactDOM from 'react-dom';

import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import { CssBaseline, ThemeProvider, Snackbar } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import InstrumentList from "./scenes/instruments/InstrumentList";
import InstrumentForm from "./scenes/instruments/InstrumentForm";
import CategoryList from "./scenes/categories/CategoryList";
import CategoryForm from "./scenes/categories/CategoryForm";
import UserList from "./scenes/users/UserList";
import UserForm from "./scenes/users/UserForm";
import { LoginForm } from "./scenes/authentication/LoginForm";

import Layout from './Layout';

const AppRouter = () => {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');

  
  const handleLogin = (token) => {
    if(token){
      setIsLoggedIn(true);
      setToken(token);
    }
  };

  const handleLogout = () => {
    console.log('ENGREEEE');
    setIsLoggedIn(false);
    setToken('');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    //setIsLoggedIn(true);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <ColorModeContext.Provider value={colorMode}>
      {isMobile ? (
      <p>El panel de administración no está disponible en dispositivos móviles.</p>
      ) : (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            {isLoggedIn ? (
              <>
                <Sidebar isSidebar={isSidebar} />
                <main className="content">
                  <Topbar setIsSidebar={setIsSidebar} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
                  <Layout>
                  <Routes>
                    <Route path="/admin" element={<Dashboard />} />
                    <Route path="/admin/instruments" element={<InstrumentList showSnackbar={showSnackbar} token={token} />} />
                    <Route path="/admin/instrument/:id" element={<InstrumentForm token={token} />} />
                    <Route path="/admin/categories" element={<CategoryList showSnackbar={showSnackbar} token={token} />} />
                    <Route path="/admin/category/:id" element={<CategoryForm token={token} />} />
                    <Route path="/admin/users" element={<UserList showSnackbar={showSnackbar} token={token} />} />
                    <Route path="/admin/user/:id" element={<UserForm token={token} />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                  </Layout>
                </main>
              </>
            ) : (
              <LoginForm onLogin={handleLogin}/>
            )}
            <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              open={snackbarOpen && !!snackbarMessage}
              autoHideDuration={4000}
              onClose={handleSnackbarClose}
              message={snackbarMessage}
            />
          </div>
        </ThemeProvider>        
      )}
    </ColorModeContext.Provider>
  );

  ReactDOM.render(
    <React.StrictMode>
      <CloudinaryContext cloudName="djgwbcthz">
        <AppRouter />
      </CloudinaryContext>
    </React.StrictMode>,
    document.getElementById('root')
  );
}

export default AppRouter;
