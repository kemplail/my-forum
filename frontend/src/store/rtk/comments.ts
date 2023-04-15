import { Comment } from "src/types/comment";
import { Post } from "src/types/post";
import { commentForm } from "src/types/commentForm";
import { LikeComment } from "src/types/likeComment";
import { likeCommentForm } from "src/types/likeCommentForm";
import { emptySplitApi } from "./emptySplitApi";

export const commentApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommentsOfAPost: builder.query<Comment[], string>({
      query: (id) => ({
        url: `comments/post/${id}`,
        method: "GET",
      }),
      providesTags: ["Comment", "LikeComment"],
    }),
    addComment: builder.mutation<Comment, commentForm>({
      query: (comment) => ({
        url: "comments",
        method: "POST",
        data: comment,
      }),
      invalidatesTags: ["Comment"],
    }),
    updateComment: builder.mutation<Comment, Comment>({
      query: (comment) => ({
        url: `comments/${comment._id}`,
        method: "PATCH",
        data: comment,
      }),
      invalidatesTags: ["Comment"],
    }),
    deleteComment: builder.mutation<Post, string>({
      query: (id) => ({
        url: `comments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comment"],
    }),
    addALikeComment: builder.mutation<LikeComment, likeCommentForm>({
      query: (like) => ({
        url: "likes/comment",
        method: "POST",
        data: like,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "LikeComment", post: arg.comment },
      ],
    }),
    getLikeOfUserOnComment: builder.query<LikeComment, string>({
      query: (id) => ({
        url: `likes/comment/loggeduser/${id}`,
        method: "GET",
      }),
      providesTags: ["LikeComment"],
    }),
    deleteLikeOfUserOnComment: builder.mutation<LikeComment, string>({
      query: (id) => ({
        url: `likes/comment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LikeComment"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCommentsOfAPostQuery,
  useAddALikeCommentMutation,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useDeleteLikeOfUserOnCommentMutation,
  useGetLikeOfUserOnCommentQuery,
  useUpdateCommentMutation,
} = commentApi;
