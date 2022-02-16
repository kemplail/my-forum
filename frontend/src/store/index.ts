import thunkMiddleware from 'redux-thunk'
import { configureStore } from "@reduxjs/toolkit"
import { localStorageAuthMiddleware } from "./middlewares/localStorageAuth"
import { loginMiddleware } from "./middlewares/login"
import rootReducer from "./reducers"
import { postApi } from './rtk/post'
import { commentApi } from './rtk/comments'

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).prepend(localStorageAuthMiddleware, loginMiddleware).concat(thunkMiddleware,postApi.middleware,commentApi.middleware),
    devTools: process.env.NODE_ENV !== 'production'
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store
