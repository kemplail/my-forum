import { useSemanticSearchQuery } from "src/store/rtk/post";
import { PostsList } from "./PostsList";
import { PaginationBar } from "src/paginationbar/PaginationBar";

const ITEMS_PER_PAGE = 10;

export function SemanticSearchPosts({
  query,
  page,
  onPrevious,
  onNext,
}: {
  query: string;
  page: number;
  onPrevious: VoidFunction;
  onNext: VoidFunction;
}) {
  const { data, isLoading } = useSemanticSearchQuery({
    query,
    pageSize: ITEMS_PER_PAGE,
    page,
  });

  return (
    <>
      <PostsList posts={data?.documents} isLoading={isLoading} />

      <PaginationBar
        onPrevious={onPrevious}
        onNext={onNext}
        page={page}
        totalCount={data?.meta.totalCount}
        dataIsLoading={isLoading}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </>
  );
}
