interface SubmitButtonProps {
    value: string
}

export default function SubmitButton(props : SubmitButtonProps) {
    return (
        <input type="submit" value={ props.value } className="ml-auto bg-blue-500 hover:bg-blue-700 text-white font-bold rounded h-10 p-2"/>
    );
}