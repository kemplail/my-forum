export function PaginationButton({
  onClick,
  direction,
}: {
  onClick: VoidFunction;
  direction: "previous" | "next";
}) {
  return (
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      onClick={onClick}
    >
      {direction === "previous" ? "Précédent" : "Suivant"}
    </button>
  );
}
