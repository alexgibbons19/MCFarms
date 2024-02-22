import React from 'react';
import { Link } from 'react-router-dom';

const DropdownMenu = ({ closeDropdowns }) => {
  return (
    <div id="dropdownMenu" className="dropdown-content">
      <Link to="/" onClick={closeDropdowns}>Home</Link>
      <Link to="/weather" onClick={closeDropdowns}>Weather</Link>
      <Link to="/inventory" onClick={closeDropdowns}>Inventory</Link>
      <Link to="/calendar" onClick={closeDropdowns}>Calendar</Link>
      <Link to="/discussion-board" onClick={closeDropdowns}>Discussion Board</Link>
      <Link to="/reminders" onClick={closeDropdowns}>Reminders</Link>
      <Link to="/optimal-crops" onClick={closeDropdowns}>Optimal Crops</Link>
    </div>
  );
};

export default DropdownMenu;
