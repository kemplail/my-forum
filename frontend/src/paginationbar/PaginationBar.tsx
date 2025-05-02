import { PaginationButton } from "./PaginationButton";

export function PaginationBar({
  page,
  onPrevious,
  onNext,
}: {
  page: number;
  onPrevious: VoidFunction;
  onNext: VoidFunction;
}) {
  return (
    <div className="flex justify-between items-center w-full mt-4">
      <PaginationButton onClick={onPrevious} direction="previous" />
      <div className="text-gray-700 font-medium">Page {page}</div>
      <PaginationButton onClick={onNext} direction="next" />
    </div>
  );
}
