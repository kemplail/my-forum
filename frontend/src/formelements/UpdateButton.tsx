import { PencilIcon } from "@heroicons/react/solid";

interface UpdateButtonProps {
    onClick: VoidFunction
}

export function UpdateButton(props : UpdateButtonProps) {
    return (
        <button onClick={props.onClick} className='ml-auto flex bg-green-500 hover:bg-green-700 text-white font-bold rounded h-10 p-2'><PencilIcon className="h-5 w-5" /><span>Modifier</span></button>
    );
}