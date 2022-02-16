interface CancelButtonProps {
    onClick: VoidFunction
}

export function CancelButton(props: CancelButtonProps) {
    return (
        <button onClick={props.onClick} className='bg-gray-500 hover:bg-gray-700 text-white font-bold rounded h-10 p-2'>Annuler</button>
    );
}