import React from 'react';
import Home from '../../pages/Home/Home';

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <Home />
            <div className="layout-content">
                {children} 
            </div>
        </div>
    );
};

export default Layout;
