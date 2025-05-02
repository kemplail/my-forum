import { PaginationButton } from "./PaginationButton";

export function PaginationBar({
  page,
  onPrevious,
  onNext,
  totalCount,
  dataIsLoading,
}: {
  page: number;
  onPrevious: VoidFunction;
  onNext: VoidFunction;
  totalCount?: number;
  dataIsLoading: boolean;
}) {
  return (
    <div className="flex justify-between items-center w-full mt-4">
      <PaginationButton
        onClick={onPrevious}
        direction="previous"
        disabled={dataIsLoading}
      />
      <div className="text-gray-700 font-medium">
        Page {page} | {totalCount ?? 0} éléments au total
      </div>
      <PaginationButton
        onClick={onNext}
        direction="next"
        disabled={dataIsLoading}
      />
    </div>
  );
}
