import React, { useState } from 'react';
import './css/Footer.css';



const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="left-content">
        <img src={process.env.PUBLIC_URL + '/images/logo.png'} alt="logo" />
        <div className='copy'>
        <span className="copyright">&copy; Doremi {year}. Todos los derechos reservados</span>
        </div>
      </div>
      <div className='right-content'>
        <div className='social-medias-title'>
          <h4>Seguinos en nuestras redes sociales</h4>
        </div>
        <div className='social-medias'>
        

        <img src={process.env.PUBLIC_URL + '/images/footer/facebook.png'} alt="Facebook" />
        <img src={process.env.PUBLIC_URL + '/images/footer/instagram.png'} alt="Instagram" />
        <img src={process.env.PUBLIC_URL + '/images/footer/X.png'} alt="X" />
        <img src={process.env.PUBLIC_URL + '/images/footer/tiktok.png'} alt="TikTok" />
        </div>

        </div>
    </footer>
  );
};

export default Footer;
