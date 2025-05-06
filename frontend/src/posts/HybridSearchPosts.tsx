import { useHybridSearchQuery } from "src/store/rtk/post";
import { PostsList } from "./PostsList";

const POSTS_LIMIT = 10;

export function HybridSearchPosts({ query }: { query: string }) {
  const { data, isLoading } = useHybridSearchQuery({
    query,
    limit: POSTS_LIMIT,
  });

  return <PostsList posts={data} isLoading={isLoading} />;
}
