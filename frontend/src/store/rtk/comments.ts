import { axiosBaseQuery } from "../axiosBaseQuery";
import { createApi } from '@reduxjs/toolkit/query/react'
import { Comment } from "src/types/comment";
import { Post } from "src/types/post";
import { commentForm } from "src/types/commentForm";

export const commentApi = createApi({
  reducerPath: 'commentApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Comment'],
  endpoints: (builder) => ({
    getCommentsOfAPost: builder.query<Comment[], string>({
        query: (id) => ({
            url: `comments/post/${id}`,
            method: "GET",
        }),
        providesTags: ["Comment"]
    }),
    addComment: builder.mutation<Comment, commentForm> ({
      query: (comment) => ({
        url:'comments',
        method:"POST",
        data: comment
      }),
      invalidatesTags: ["Comment"]
    }),
    updateComment: builder.mutation<Comment, Comment> ({
      query: (comment) => ({
        url: `comments/${comment._id}`,
        method: "PATCH",
        data: comment
      }),
      invalidatesTags: ["Comment"]
    }),
    deleteComment: builder.mutation<Post, string> ({
      query: (id) => ({
        url: `comments/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Comment"]
    })
  }),
})

export const { useGetCommentsOfAPostQuery, useAddCommentMutation, useUpdateCommentMutation, useDeleteCommentMutation } = commentApi