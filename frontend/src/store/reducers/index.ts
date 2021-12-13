import { combineReducers } from "@reduxjs/toolkit"
import { userSlice } from '../slices/user'

const rootReducer = combineReducers({
    [userSlice.name]: userSlice.reducer,
})

export default rootReducer