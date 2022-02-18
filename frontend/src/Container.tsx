interface ContainerProps {
    children: React.ReactNode
}

export default function Container(props : ContainerProps) {
    return (
        <div className="px-32 py-4">
            {
                props.children
            }
        </div>
    );
}