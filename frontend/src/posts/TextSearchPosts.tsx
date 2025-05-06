import { useEffect, useMemo, useState } from "react";
import { useGetAllPostsQuery } from "src/store/rtk/post";
import { PaginationBar } from "src/paginationbar/PaginationBar";
import { PostsList } from "./PostsList";

const ITEMS_PER_PAGE = 10;

export function TextSearchPosts({ query }: { query: string }) {
  const [page, setPage] = useState(1);
  const [paginationToken, setPaginationToken] = useState<string | null>(null);
  const [direction, setDirection] = useState<"before" | "after" | null>(null);

  const { data, isLoading } = useGetAllPostsQuery({
    pageSize: ITEMS_PER_PAGE,
    query,
    paginationToken,
    direction,
  });

  useEffect(() => {
    setPaginationToken(null);
    setDirection(null);
    setPage(1);
  }, [query]);

  const { firstToken, lastToken } = useMemo(() => {
    if (data && data.documents.length >= 1) {
      return {
        firstToken: data.documents[0].paginationToken,
        lastToken: data.documents[data.documents.length - 1].paginationToken,
      };
    }
    return { firstToken: null, lastToken: null };
  }, [data]);

  function goToNextPage() {
    setPaginationToken(lastToken);
    setDirection("after");
    setPage((previousPage) => previousPage + 1);
  }

  function goToPreviousPage() {
    setPaginationToken(firstToken);
    setDirection("before");
    setPage((prev) => Math.max(prev - 1, 1));
  }

  return (
    <>
      <PostsList posts={data?.documents} isLoading={isLoading} />

      <PaginationBar
        onPrevious={goToPreviousPage}
        onNext={goToNextPage}
        page={page}
        totalCount={data?.meta.totalCount}
        dataIsLoading={isLoading}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </>
  );
}
