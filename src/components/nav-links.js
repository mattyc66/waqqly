import React, { useEffect } from 'react';
import  './nav-links.css'
import wagglylogo from '../components/images/finalv1.png';
import { FaSearch } from "react-icons/fa";
import { Link } from 'react-router-dom'
import Authentication from './Authentication';

const NavLinks = (props) => {
  const isLoggedin = localStorage.getItem('userUID') !== null;
  const signOutAction = () => {
    localStorage.removeItem('userUID');
    window.location.reload()
  };


    return (
        <header className="Navbar">
          <Link to="/homepage" className="homenav">
          <img src={wagglylogo} alt="" className="Logo" />
            </Link> 
          <Link to="/main" className="search-link">
            <FaSearch className="search"></FaSearch>
            <span className='Search-text'>Search</span>
          </Link>
          <div className="Nav-buttons">
            <Authentication/>
          </div>
        </header>
    )
    }
  export default NavLinks