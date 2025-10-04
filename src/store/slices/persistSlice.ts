import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface PersistState {
    persistUid: String | null,
}

const initialState: PersistState = {
    persistUid: null,
}

const persistSlice = createSlice({
    name: 'persist',
    initialState,
    reducers: {
        setPersistUid: (state, action: PayloadAction<String | null>) => {
            state.persistUid = action.payload
        }
    },
})

export const { setPersistUid } = persistSlice.actions
export default persistSlice.reducer
