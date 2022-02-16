interface ValideMessageType {
    children: React.ReactNode
}

export function ValideMessage(props: ValideMessageType) {
    return (<div className="text-green-700 flex space-x-2">
        { props.children }
    </div>);
}