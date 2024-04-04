import React from 'react';
import Profile from './Profile';
import Footer from './Footer';
import Header from './Header';
import './css/Profile.css';
import './css/Footer.css';
import './css/NewHeader.css';

function HomeProfile () {
  return (
    <div>
      <Header />
      <Profile />
      <Footer />
    </div>
  );
}

export default HomeProfile;