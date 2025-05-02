export function PaginationButton({
  onClick,
  direction,
  disabled,
}: {
  onClick: VoidFunction;
  direction: "previous" | "next";
  disabled: boolean;
}) {
  return (
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      onClick={onClick}
      disabled={disabled}
    >
      {direction === "previous" ? "Précédent" : "Suivant"}
    </button>
  );
}
