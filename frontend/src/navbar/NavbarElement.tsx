import { Link } from "react-router-dom";

interface NavbarElementProps {
    link: string,
    name: string
}

export default function NavbarElement(props : NavbarElementProps) {

    return(
        <li className="m-4 rounded-md hover:bg-amber-300 p-2 text-blue-500 hover:text-blue-800"><Link to={props.link}>{props.name}</Link></li>
    );

}