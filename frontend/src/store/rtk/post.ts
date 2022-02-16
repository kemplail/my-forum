import api from "src/services";
import { Post } from "src/types/post";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { createApi } from '@reduxjs/toolkit/query/react'
import { PostForm } from "src/types/postForm";

export const postApi = createApi({
  reducerPath: 'postApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getAllPosts: builder.query<Post[], void>({
      query: () => ({
        url: 'posts',
        method: 'GET'
      }),
      providesTags: ["Post"]
    }),
    addPost: builder.mutation<Post, PostForm>({
      query: (post) => ({
        url: 'posts',
        method: 'POST',
        data: post
      }),
      invalidatesTags: ["Post"]
    }),
    updatePost: builder.mutation<Post, Post>({
      query: (post) => ({
        url: `posts/${post._id}`,
        method: "PATCH",
        data: post 
      }),
      invalidatesTags: ["Post"]
    }),
    deletePost: builder.mutation<Post, string>({
      query: (id) => ({
        url: `posts/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Post"]
    }),
    getAPost: builder.query<Post, string>({
      query: (id) => ({
        url: `posts/${id}`,
        method: 'GET'
      }),
      providesTags: ["Post"]
    })
  }),
})

export const { useGetAllPostsQuery, useAddPostMutation, useUpdatePostMutation, useDeletePostMutation, useGetAPostQuery } = postApi