interface DateProps {
    children: React.ReactNode
}

export function DateElement(props: DateProps) {
    return (
        <span className='italic'>
            { props.children }
        </span>
    );
}