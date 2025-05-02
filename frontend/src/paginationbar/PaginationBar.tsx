import { PaginationButton } from "./PaginationButton";

export function PaginationBar({
  page,
  onPrevious,
  onNext,
  totalCount = 0,
  itemsPerPage,
  dataIsLoading,
}: {
  page: number;
  onPrevious: VoidFunction;
  onNext: VoidFunction;
  totalCount?: number;
  itemsPerPage: number;
  dataIsLoading: boolean;
}) {
  function hasNextPage({
    totalCount,
    page,
    itemsPerPage,
  }: {
    totalCount: number;
    page: number;
    itemsPerPage: number;
  }) {
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    return page < totalPages;
  }

  return (
    <div className="flex justify-between items-center w-full mt-4">
      <PaginationButton
        onClick={onPrevious}
        direction="previous"
        disabled={dataIsLoading || page === 1}
      />
      <div className="text-gray-700 font-medium">
        Page {page} | {totalCount} éléments au total
      </div>
      <PaginationButton
        onClick={onNext}
        direction="next"
        disabled={
          dataIsLoading || !hasNextPage({ totalCount, page, itemsPerPage })
        }
      />
    </div>
  );
}
