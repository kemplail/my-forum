import React from 'react';
import Login from './Login';

export function Header(props) {
    return (
        <header>
            <h1>My forum</h1>
            <Login />
        </header>
    )
}