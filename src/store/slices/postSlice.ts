import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface PostState {
    loggedInpost: any
}

const initialState: PostState = {
    loggedInpost: null,
}

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        setLoggedInpost: (state, action: PayloadAction<any>) => {
            state.loggedInpost = action.payload
        }
    },
})

export const { setLoggedInpost } = postSlice.actions
export default postSlice.reducer
