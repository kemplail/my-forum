import { TrashIcon } from "@heroicons/react/solid";

interface DeleteButtonProps {
    onClick: VoidFunction
}

export function DeleteButton(props: DeleteButtonProps) {
    return(
        <button onClick={props.onClick} className='flex bg-red-500 hover:bg-red-700 text-white font-bold rounded h-10 p-2'><TrashIcon className="h-5 w-5" /><span>Supprimer</span></button>
    );
}