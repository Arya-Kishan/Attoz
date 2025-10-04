import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface PersistState {
    persistUid: string,
}

const initialState: PersistState = {
    persistUid: "",
}

const persistSlice = createSlice({
    name: 'persist',
    initialState,
    reducers: {
        setPersistUid: (state, action: PayloadAction<string>) => {
            state.persistUid = action.payload
        }
    },
})

export const { setPersistUid } = persistSlice.actions
export default persistSlice.reducer
