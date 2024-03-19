import { Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { CloudinaryContext } from 'cloudinary-react';
import ReactDOM from 'react-dom';

import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import InstrumentList from "./scenes/instruments/InstrumentList";
import InstrumentForm from "./scenes/instruments/InstrumentForm";
import CategoryList from "./scenes/categories/CategoryList";
import CategoryForm from "./scenes/categories/CategoryForm";
function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

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
            <Sidebar isSidebar={isSidebar} />
            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/instruments" element={<InstrumentList />} />
                <Route path="/instrument/:id" element={<InstrumentForm />} />
                <Route path="/categories" element={<CategoryList />} />
                <Route path="/category/:id" element={<CategoryForm />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </ThemeProvider>        
      )}
    </ColorModeContext.Provider>
  );

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
