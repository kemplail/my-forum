export default function SubmitButton(props) {
    return (
        <input disabled={props.isValid} type="submit" value="Ajouter" />
    );
}