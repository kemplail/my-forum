import { useEffect, useState } from "react";
import { SemanticSearchPosts } from "./SemanticSearchPosts";
import { HybridSearchPosts } from "./HybridSearchPosts";

export function AdvancedSearchPosts({
  query,
  searchMode,
}: {
  query: string;
  searchMode: "semantic" | "hybrid";
}) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [query, searchMode]);

  function goToNextPage() {
    setPage((previousPage) => previousPage + 1);
  }

  function goToPreviousPage() {
    setPage((prev) => Math.max(prev - 1, 1));
  }

  return (
    <>
      {searchMode === "semantic" ? (
        <SemanticSearchPosts
          query={query}
          page={page}
          onPrevious={goToPreviousPage}
          onNext={goToNextPage}
        />
      ) : (
        <HybridSearchPosts
          query={query}
          page={page}
          onPrevious={goToPreviousPage}
          onNext={goToNextPage}
        />
      )}
    </>
  );
}
