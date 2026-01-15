"use client";

import React from 'react';
import NavbarComponent from '../../Components/Navbar/Navbar';

function UserLayout({ children }){
    return (
        <div>
            <NavbarComponent/>
            {children}
        </div>
    );
}

export default UserLayout;