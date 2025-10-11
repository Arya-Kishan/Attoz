import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { UserType } from '../../types/userTypes'

interface UserState {
    loggedInUser: UserType | null,
    showAuthGuard: boolean,
}

const initialState: UserState = {
    loggedInUser: null,
    showAuthGuard: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setLoggedInUser: (state, action: PayloadAction<UserType>) => {
            state.loggedInUser = action.payload
        },
        setShowAuthGuard: (state, action: PayloadAction<boolean>) => {
            state.showAuthGuard = action.payload
        },
    },
})

export const { setLoggedInUser, setShowAuthGuard } = userSlice.actions
export default userSlice.reducer
