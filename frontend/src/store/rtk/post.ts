import { PaginatedPosts, Post } from "src/types/post";
import { PostForm } from "src/types/postForm";
import { LikePost } from "src/types/likePost";
import { LikePostForm } from "src/types/likePostForm";
import { emptySplitApi } from "./emptySplitApi";

type PaginationParams = {
  pageSize: number;
  paginationToken: string | null;
  direction: "before" | "after" | null;
};

type GetAllPostsParams = PaginationParams & {
  query: string | null;
};

export const postApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPosts: builder.query<PaginatedPosts, GetAllPostsParams>({
      query: ({ pageSize, query, paginationToken, direction }) => {
        const params: string[] = [];

        params.push(`pageSize=${pageSize}`);

        if (query) params.push(`query=${encodeURIComponent(query)}`);

        if (paginationToken && direction) {
          params.push(`paginationToken=${encodeURIComponent(paginationToken)}`);
          params.push(`direction=${direction}`);
        }

        return {
          url: `posts?${params.join("&")}`,
          method: "GET",
        };
      },
      providesTags: ["Post", "LikePost"],
    }),
    addPost: builder.mutation<Post, PostForm>({
      query: (post) => ({
        url: "posts",
        method: "POST",
        data: post,
      }),
      invalidatesTags: ["Post"],
    }),
    updatePost: builder.mutation<Post, Post>({
      query: (post) => ({
        url: `posts/${post._id}`,
        method: "PATCH",
        data: post,
      }),
      invalidatesTags: ["Post"],
    }),
    deletePost: builder.mutation<Post, string>({
      query: (id) => ({
        url: `posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),
    getAPost: builder.query<Post, string>({
      query: (id) => ({
        url: `posts/${id}`,
        method: "GET",
      }),
      providesTags: ["Post", "LikePost"],
    }),
    addALikePost: builder.mutation<LikePost, LikePostForm>({
      query: (like) => ({
        url: "likes/post",
        method: "POST",
        data: like,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "LikePost", post: arg.post },
      ],
    }),
    getLikeOfUserOnPost: builder.query<LikePost, string>({
      query: (id) => ({
        url: `likes/post/loggeduser/${id}`,
        method: "GET",
      }),
      providesTags: ["LikePost"],
    }),
    deleteLikeOfUserOnPost: builder.mutation<LikePost, string>({
      query: (id) => ({
        url: `likes/post/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LikePost"],
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetAPostQuery,
  useAddALikePostMutation,
  useGetLikeOfUserOnPostQuery,
  useDeleteLikeOfUserOnPostMutation,
} = postApi;
