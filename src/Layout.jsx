// En el proyecto de Panel Admin
// Layout.js
import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div>
      <header>
        <Link to="/">Ir al Sistema de Reservas</Link>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
