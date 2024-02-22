import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import '../assets/BurgerMenu.css';
import CalendarPage from "./CalendarPage.jsx";
import RemindersPage from "./RemindersPage.jsx";


const BurgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
      setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

return (
    <div className="burger-menu">
      {/* Burger icon button */}
      <div className="burger-icon" onClick={toggleMenu}>
        <div className={`burger-line ${isOpen ? 'open' : ''}`} />
        <div className={`burger-line ${isOpen ? 'open' : ''}`} />
        <div className={`burger-line ${isOpen ? 'open' : ''}`} />
      </div>

      {/* Menu items - link to actual pages here but deafault is close */}
      
      <div className={`menu ${isOpen ? 'open' : ''}`}>
        <ul>
        <li onClick={closeMenu}>Home</li>
        <li onClick={closeMenu}>Reminders</li>
        <li onClick={closeMenu}>Calendar</li>
        <li onClick={closeMenu}>Crop Search</li>
        <li onClick={closeMenu}>Close</li>
        </ul>
      </div>
    </div>
  );
};

export default BurgerMenu;