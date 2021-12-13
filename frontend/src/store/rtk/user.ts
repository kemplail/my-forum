import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../axiosBaseQuery'

export const userApi = createApi({
    reducerPath: '',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        getUser: builder.query<any, any>({
            query: (userId) => ({
                url: '',
                method: 'GET',
                data: { userId }
            })
        })
    })
})

export const { useGetUserQuery } = userApi