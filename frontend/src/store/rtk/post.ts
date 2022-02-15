import api from "src/services";
import { Post } from "src/types/post";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { createApi } from '@reduxjs/toolkit/query/react'

export const postApi = createApi({
  reducerPath: 'postApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getAllPosts: builder.query<Post[], void>({
      query: () => ({
        url: 'posts',
        method: 'GET'
      }),
    }),
  }),
})

export const { useGetAllPostsQuery } = postApi