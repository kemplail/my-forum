export default function Container(props) {
    return (
        <div className="px-32 py-4">
            {
                props.children
            }
        </div>
    );
}