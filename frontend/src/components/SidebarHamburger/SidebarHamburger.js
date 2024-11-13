import React from 'react';
import { Link } from 'react-router-dom';
import './SidebarHamburger.css';

function SidebarHamburger() {
  return (
    <div className="sidebar-hamburger">
      <Link to="/" className="sidebar-item">
        <i className="fas fa-home"></i> Home
      </Link>
      <Link to="/income" className="sidebar-item">
        <i className="fas fa-chart-line"></i> Income
      </Link>
      <Link to="/expenses" className="sidebar-item">
        <i className="fas fa-wallet"></i> Expenses
      </Link>
      <Link to="/history" className="sidebar-item">
        <i className="fas fa-history"></i> History
      </Link>
    </div>
  );
}

export default SidebarHamburger;

