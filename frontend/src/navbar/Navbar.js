import React, { useEffect, useState } from 'react';
import NavbarElement from './NavbarElement';

export function Navbar(props) {
    
    return (
        <div className="navbar">
            <ul>
                <NavbarElement name="Accueil" link="/" />
                <NavbarElement name="Fil des posts" link="/posts" />
            </ul>
        </div>
    )

}