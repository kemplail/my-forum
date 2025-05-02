export default function Title(props) {
  const { as: As = "h1" } = props;
  return (
    <As className="whitespace-nowrap text-2xl mt-4 mb-8 mr-4 text-blue-700 font-bold">
      {props.children}
    </As>
  );
}
