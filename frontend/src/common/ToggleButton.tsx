import { useState } from "react";

export default function ToggleButton({
  onToggle,
  label,
}: {
  onToggle: (isToggled: boolean) => void;
  label?: string;
}) {
  const [toggled, setToggled] = useState(false);

  const handleClick = () => {
    const next = !toggled;
    setToggled(next);
    onToggle(next);
  };

  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm text-gray-700">{label}</span>}
      <button
        onClick={handleClick}
        className={`px-4 py-2 rounded-full transition-colors duration-300 text-white ${
          toggled
            ? "bg-green-500 hover:bg-green-600"
            : "bg-gray-400 hover:bg-gray-500"
        }`}
      >
        {toggled ? "On" : "Off"}
      </button>
    </div>
  );
}
