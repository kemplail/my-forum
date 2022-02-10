import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

export default function NavbarElement(props) {

    return(
        <li><Link to={props.link}>{props.name}</Link></li>
    );

}