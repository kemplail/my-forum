import api from "src/services";
import { Post } from "src/types/post";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { createApi } from '@reduxjs/toolkit/query/react'
import { PostForm } from "src/types/postForm";
import { LikePost } from "src/types/likePost";
import { LikePostForm } from "src/types/likePostForm";

export const postApi = createApi({
  reducerPath: 'postApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Post','LikePost'],
  endpoints: (builder) => ({
    getAllPosts: builder.query<Post[], void>({
      query: () => ({
        url: 'posts',
        method: 'GET'
      }),
      providesTags: ["Post","LikePost"]
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
      providesTags: ["Post","LikePost"]
    }),
    addALike: builder.mutation<LikePost, LikePostForm>({
      query: (like) => ({
          url: 'likes/post',
          method: 'POST',
          data: like
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'LikePost', post: arg.post }
      ],
    }),
    getLikeOfUserOnPost: builder.query<LikePost, string>({
      query: (id) => ({
        url: `likes/post/loggeduser/${id}`,
        method: "GET"
      }),
      providesTags: ["LikePost"]
    }),
    deleteLikeOfUserOnPost: builder.mutation<LikePost, string>({
      query: (id) => ({
        url: `likes/post/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["LikePost"]
    })
  }),
})

export const { useGetAllPostsQuery, useAddPostMutation, useUpdatePostMutation, useDeletePostMutation, useGetAPostQuery, useAddALikeMutation, useGetLikeOfUserOnPostQuery, useDeleteLikeOfUserOnPostMutation } = postApi