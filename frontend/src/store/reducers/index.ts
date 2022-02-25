import { AnyAction, combineReducers, CombinedState } from "@reduxjs/toolkit"
import { commentApi } from "../rtk/comments"
import { emptySplitApi } from "../rtk/emptySplitApi"
import { metricsApi } from "../rtk/metrics"
import { postApi } from "../rtk/post"
import { userApi } from "../rtk/user"
import { PostSlice } from "../slices/post"
import { userSlice } from '../slices/user'

const appReducer = combineReducers({
    [userSlice.name]: userSlice.reducer,
    [PostSlice.name]: PostSlice.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [emptySplitApi.reducerPath] : emptySplitApi.reducer
})

const rootReducer = (state : CombinedState<any>, action : AnyAction) => {
    if (action.type === 'user/clearState') {
        state = undefined
    }
    return appReducer(state, action);
}

export default rootReducer