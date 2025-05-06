import { useSemanticSearchQuery } from "src/store/rtk/post";
import { PostsList } from "./PostsList";

const POSTS_LIMIT = 10;

export function SemanticSearchPosts({ query }: { query: string }) {
  const { data, isLoading } = useSemanticSearchQuery({
    query,
    limit: POSTS_LIMIT,
  });

  return <PostsList posts={data} isLoading={isLoading} />;
}
