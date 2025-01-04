import React from 'react';
import { Link } from 'react-router-dom'
import '../styles/NavBar.scss';
import logo from '../images/Logo.png';
import menu from '../images/arrow.png';

const Navbar = () => {
  const username = "vladimir27";
  return (
    <nav>
      <div className="logo">
        <img src={logo}/>
      </div>
      <ul>
        <li>Dashboard</li>
        <li>Wallet</li>
        <li>Transfer Crypto</li>
        <li>My Account</li>
        <li className="username">{username}</li>
      </ul>
      <div className="button">
        <img src={menu}/>
        </div>
    </nav>
  );
};

export default Navbar;