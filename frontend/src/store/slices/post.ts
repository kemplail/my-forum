import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Post } from '../../types/post';

export const PostSlice = createSlice(
    {
        name: 'post',
        initialState: {
            posts:[]
        },
        reducers: {
            add: (state, postPayload: PayloadAction<Post>) => {
                state.posts.push(postPayload.payload);
            },
            delete: (state, id) => {
                const newPosts = state.posts.filter((element) => {
                    return element._id != id;
                });
                state.posts = newPosts;
            },
            update: (state, postPayload: PayloadAction<Post>) => {
                const newPosts = state.posts.map((element) => {
                    if(element._id == postPayload.payload._id) {
                        return postPayload.payload;
                    }
                    return element;
                })
            }
        }
    }
)