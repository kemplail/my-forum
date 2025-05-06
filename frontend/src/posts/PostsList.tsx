import { Post } from "src/types/post";
import { PostElement } from "./PostElement";

export function PostsList({
  isLoading,
  posts,
}: {
  isLoading: boolean;
  posts?: Post[];
}) {
  function showPosts() {
    return posts?.map((element: Post) => {
      return <PostElement key={element._id} post={element} />;
    });
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {!isLoading ? showPosts() : <span>Loading...</span>}
    </div>
  );
}
