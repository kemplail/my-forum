import React, { useEffect, useState } from 'react';
import NavbarElement from './NavbarElement';
import { Link } from 'react-router-dom';

export function Navbar(props) {
    
    return (
        <div className="navbar flex bg-slate-200 border-solid border-2 border-gray-400">
            <Link to="/"><img className='h-18 w-40 mt-2 ml-2' src="http://static1.squarespace.com/static/58ffa7cae4fcb5b3f1e21577/t/58ffaa9f20099e9f05827f23/1493150371764/myforumwords.png" /></Link>
            <ul>
                <NavbarElement name="Fil des posts" link="/posts" />
            </ul>
        </div>
    )

}