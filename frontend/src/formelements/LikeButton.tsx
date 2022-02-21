interface LikeButtonProps {
    onClick: VoidFunction
    value: string
}

export function LikeButton(props: LikeButtonProps) {
    return (
        <button onClick={props.onClick} className='bg-pink-500 hover:bg-pink-700 text-white font-bold rounded p-2'> {props.value} </button>
    );
}