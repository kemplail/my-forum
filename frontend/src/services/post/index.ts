import { AxiosResponse } from 'axios'
import { Post } from 'src/types/post';
import api from '..'

export const getPosts = (): Promise<AxiosResponse<Post[]>> => {
    return api.get('/posts');
}

export const addPost = (post: Post): Promise<AxiosResponse<Post>> => {
    return api.post('/posts',post)
}

export const deletePost = (id: number): Promise<AxiosResponse<any>> => {
    return api.delete(`/posts/${id}`);
}

export const updatePost = (post: Post): Promise<AxiosResponse<Post>> => {
    return api.patch(`/posts/${post._id}`, post);
}

export const getPost = (id: number): Promise<AxiosResponse<Post>> => {
    return api.get(`/posts/${id}`);
}