interface DeconnexionButtonProps {
    onClick : VoidFunction
}

export function DeconnexionButton(props : DeconnexionButtonProps) {
    return (<li className="m-4 rounded-md hover:bg-amber-300 p-2 text-blue-500 hover:text-blue-800"><button onClick={props.onClick}>Se déconnecter</button></li>);
}