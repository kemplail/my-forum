import { createApi } from '@reduxjs/toolkit/query/react'
import { User } from 'src/types/user'
import { UserRegisterForm } from 'src/types/userRegisterForm'
import { axiosBaseQuery } from '../axiosBaseQuery'
import { emptySplitApi } from './emptySplitApi'

export const userApi = emptySplitApi.injectEndpoints({
    endpoints: (builder) => ({
        addUser: builder.mutation<User,UserRegisterForm> ({
            query: (user) => ({
                url: 'users',
                method: 'POST',
                data: user
            }),
            invalidatesTags: ['User']
        }),
        loggedUser: builder.query<User, void> ({
            query: () => ({
                url: 'auth/loggedUser',
                method: 'GET'
            }),
            providesTags: ['User']
        })
    })
})

export const { useAddUserMutation, useLoggedUserQuery } = userApi