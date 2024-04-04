import { Route, Routes, Navigate } from 'react-router-dom';

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

import MaybeShowHeaderAndFooter from './components/MaybeShowHeaderAndFooter';
import Register from './components/Register';
import ProductDetail from './components/ProductDetail';
import ReservationConfirmation from './components/ReservationConfirmation';
import Body from './components/Body';
import Login from './components/Login';
import HomeUser from './components/HomeUser';
import Profile from './components/Profile';
import { AuthProvider, useAuth } from './AuthContext';

import './App.css';

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [token, setToken] = useState('');

 /* 
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
*/
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
    <AuthProvider>
    <Routes>
        <Route path="/admin/*" element={<ProtectedRoute><AdminRoutes/></ProtectedRoute>} />
        <Route path="/*" element={<HomeRoute />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );

  function AdminRoutes() {
    const { token } = useAuth();
    const { isLogged } = useAuth();
    const { logout } = useAuth();

    const handleLogout = () => {
      logout();
    };
  

    return (
      <ColorModeContext.Provider value={colorMode}>
      {isMobile ? (
      <p>El panel de administración no está disponible en dispositivos móviles.</p>
      ) : (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
              <>
                <Sidebar isSidebar={isSidebar} />
                <div className="content">
                  <Topbar setIsSidebar={setIsSidebar} isLoggedIn={isLogged} onLogout={handleLogout} />
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/instruments" element={<InstrumentList showSnackbar={showSnackbar} token={token} />} />
                    <Route path="/instrument/:id" element={<InstrumentForm token={token} />} />
                    <Route path="/categories" element={<CategoryList showSnackbar={showSnackbar} token={token} />} />
                    <Route path="/category/:id" element={<CategoryForm token={token} />} />
                    <Route path="/users" element={<UserList showSnackbar={showSnackbar} token={token} />} />
                    <Route path="/user/:id" element={<UserForm token={token} />} />
                  </Routes>
                </div>
              </>
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
  }
  
  function HomeRoute() {
    return (
        <>
        <MaybeShowHeaderAndFooter>
          <div className='content-section'>
            <Routes>
              <Route path="/" element={<Body />} />
              <Route exact path="/register" element={<Register />} />
              <Route exact path="/login" element={<Login />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/confirm-reservation" element={<ReservationConfirmation />} />
              <Route path="/homeprofile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/homeuser" element={<ProtectedRoute><HomeUser /></ProtectedRoute>} />
             </Routes>
          </div>
        </MaybeShowHeaderAndFooter>
        </>
    );
  }

  function ProtectedRoute({ children }) {
    const { isLogged } = useAuth();
    return isLogged ? children : <Navigate to="/login" />;
  }

  ReactDOM.render(
    <React.StrictMode>
      <CloudinaryContext cloudName="djgwbcthz">
        <App />
      </CloudinaryContext>
    </React.StrictMode>,
    document.getElementById('root')
  );
  
}


export default App;
