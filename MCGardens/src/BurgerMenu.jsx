import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import './assets/BurgerMenu.css';
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
        <ul className="burger-menu-options">
          <li><Link to="/home-page" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/search-page" onClick={closeMenu}>Search</Link></li>
          <li><Link to="/weather" onClick={closeMenu}>Weather</Link></li>
          <li><Link to="/inventory" onClick={closeMenu}>Inventory</Link></li>
          <li><Link to="/calendar" onClick={closeMenu}>Calendar</Link></li>
          <li><Link to="/discussion-board" onClick={closeMenu}>Discussion Board</Link></li>
          <li><Link to="/reminders" onClick={closeMenu}>Reminders</Link></li>
          <li><Link to="/optimal-plants" onClick={closeMenu}>Optimal Plants</Link></li>
          <li><Link to="/" onClick={closeMenu}>Logout</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default BurgerMenu;