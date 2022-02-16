import { combineReducers } from "@reduxjs/toolkit"
import { commentApi } from "../rtk/comments"
import { postApi } from "../rtk/post"
import { PostSlice } from "../slices/post"
import { userSlice } from '../slices/user'

const rootReducer = combineReducers({
    [userSlice.name]: userSlice.reducer,
    [PostSlice.name]: PostSlice.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer
})

export default rootReducer