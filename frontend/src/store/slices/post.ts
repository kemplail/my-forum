import { AsyncThunk, createAsyncThunk, createEntityAdapter, createSelector, createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit'
import { create } from 'yup/lib/Reference';
import api from '../../services';
import { Post } from '../../types/post';
import { axiosBaseQuery } from '../axiosBaseQuery';
import { getPosts, addPost, deletePost, updatePost, getPost } from 'src/services/post';
import { RootState } from '..';

const selectPosts = (state: RootState) => state.post.posts;
const selectPostId = (_state: RootState, postId: string) => postId

export const selectByPostId = createSelector([selectPosts, selectPostId], (posts, postId) =>
    posts.find((post) => post._id === postId)
)

export const getAllPosts = createAsyncThunk(
    'post/getPostsStatus',
    async () => {
        const response = await getPosts();
        return response.data;
    }
)

export const addAPost = createAsyncThunk(
    'post/addPostStatus',
    async (post: Post) => {
        const response = await addPost(post);
        return response;
    }
)

export const deleteAPost = createAsyncThunk(
    'post/deletePostStatus',
    async(id: number) => {
        const response = await deletePost(id);
        return response;
    }
)

export const updateAPost = createAsyncThunk(
    'post/updatePostStatus',
    async(post: Post) => {
        const response = await updatePost(post);
        return response;
    }
)

export const getAPost = createAsyncThunk(
    'post/getPostStatus',
    async(id: number) => {
        const response = await getPost(id);
        return response;
    }
)

type PostState = {
    posts: Post[],
    isLoading: boolean
}

export const PostSlice = createSlice(
    {
        name: 'post',
        initialState: {
            posts: [],
            isLoading: false
        } as PostState,
        reducers: {

        },
        extraReducers: (builder) => {
            builder.addCase(getAllPosts.fulfilled, (state, action) => {
                state.posts = action.payload;
                state.isLoading = false;
            })
            .addCase(getAllPosts.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(addAPost.fulfilled, (state, action) => {
                state.posts.push(action.payload.data);
                state.isLoading = false;
            })
            .addCase(deleteAPost.fulfilled, (state, action) => {
                state.posts = state.posts.filter((element) => {
                    return element._id != action.payload.data._id;
                });
                state.isLoading = false;
            })
            .addCase(updateAPost.fulfilled, (state, action) => {
                state.posts = state.posts.map((element) => {
                    if(element._id == action.payload.data._id) {
                        return action.payload.data;
                    }
                    return element;
                })
                state.isLoading = false;
            })
        }
    }
)