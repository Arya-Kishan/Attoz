import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { UserType } from '../../types/userTypes'

interface UserState {
    loggedInUser: UserType | null,
}

const initialState: UserState = {
    loggedInUser: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setLoggedInUser: (state, action: PayloadAction<UserType>) => {
            state.loggedInUser = action.payload
        }
    },
})

export const { setLoggedInUser } = userSlice.actions
export default userSlice.reducer
