import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './assets/BurgerMenu.css';

const BurgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    const handleLogout = () => {
        localStorage.clear();
        closeMenu();
    };

    // Use useEffect to handle the lifecycle of the outside click listener
    useEffect(() => {
        const handleOutsideClick = (event) => {
            // Close the menu if a click is outside the menu elements
            if (!document.querySelector('.burger-menu').contains(event.target)) {
                closeMenu();
            }
        };

        // Only add the listener if the menu is open
        if (isOpen) {
            document.addEventListener('click', handleOutsideClick);
        }

        // Cleanup the listener when the component is unmounted or when the menu is closed
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [isOpen]); // Ensure the effect runs only when isOpen changes

    return (
        <div className="burger-menu">
            {/* Burger icon button */}
            <div className="burger-icon" onClick={toggleMenu}>
                <div className={`burger-line ${isOpen ? 'open' : ''}`} />
                <div className={`burger-line ${isOpen ? 'open' : ''}`} />
                <div className={`burger-line ${isOpen ? 'open' : ''}`} />
            </div>

            {/* Menu items - link to actual pages here but default is close */}
            <div className={`menu ${isOpen ? 'open' : ''}`}>
              <ul className="burger-menu-options">
                <li><Link to="/home" onClick={closeMenu}>Home</Link></li>
                <li><Link to="/plant-details" onClick={closeMenu}>Search</Link></li>
                <li><Link to="/weather" onClick={closeMenu}>Weather</Link></li>
                <li><Link to="/calendar" onClick={closeMenu}>Calendar</Link></li>
                <li><Link to="/discussion-board" onClick={closeMenu}>Discussion Board</Link></li>
                <li><Link to="/reminders" onClick={closeMenu}>Reminders</Link></li>
                <li><Link to="/optimal-plants" onClick={closeMenu}>Optimal Plants</Link></li>
                <li><Link to="/about-us" onClick={closeMenu}>About Us</Link></li>
                <li><Link to="/account-settings" onClick={closeMenu}>Account Settings</Link></li>
                <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
              </ul>
            </div>
        </div>
    );
};

export default BurgerMenu;
