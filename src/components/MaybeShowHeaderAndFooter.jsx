import React from 'react';
import { useLocation } from 'react-router-dom';
import HeaderHome from './HeaderHome';
import Footer from './Footer';

const MaybeShowHeaderAndFooter = ({ children }) => {
  const location = useLocation();

  // Lista de rutas en las que no se debe mostrar el encabezado y el pie de página
  
  const excludedRoutes = ['/register', '/login', '/homeuser', '/confirm-reservation-positive', '/confirm-reservation-negative'];

  // Verifica si la ruta actual está en la lista de rutas excluidas
  const shouldShowHeaderAndFooter = !excludedRoutes.includes(location.pathname);

  return (
    <>
      {<HeaderHome />}
      {children}
      {shouldShowHeaderAndFooter && <Footer />}
      
    </>
  );
};

export default MaybeShowHeaderAndFooter;
