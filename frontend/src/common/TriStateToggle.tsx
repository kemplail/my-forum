import { useState } from "react";

export type TriState = 0 | 1 | 2;

export default function TriStateToggle({
  onToggle,
  label,
}: {
  onToggle: (state: TriState) => void;
  label?: string;
}) {
  const [state, setState] = useState<TriState>(0);

  const states = ["Classique", "Sémantique", "Hybride"];
  const colors = ["bg-gray-400", "bg-yellow-500", "bg-green-500"];

  const handleClick = (newState: TriState) => {
    setState(newState);
    onToggle(newState);
  };

  return (
    <div className="flex flex-col items-center gap-1">
      {label && <span className="text-sm text-gray-700">{label}</span>}
      <div className="flex rounded-full overflow-hidden border">
        {states.map((label, index) => (
          <button
            key={label}
            onClick={() => handleClick(index as TriState)}
            className={`px-3 py-1 text-sm transition-colors duration-300 ${
              state === index
                ? `${colors[index]} text-white`
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
