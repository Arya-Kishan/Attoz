import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { CommentType, LikedType, PostType } from '../../types/postType'

interface PostState {
    allPosts: PostType[],
    likedArr: LikedType[],
    allComments: CommentType[],
}

const initialState: PostState = {
    allPosts: [],
    likedArr: [],
    allComments: [],
}

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        setAllPosts: (state, action: PayloadAction<PostType[]>) => {
            state.allPosts = action.payload
        },
        setLikedArr: (state, action: PayloadAction<LikedType[]>) => {
            state.likedArr = action.payload
        },
        setAllComments: (state, action: PayloadAction<CommentType[]>) => {
            state.allComments = action.payload
        }
    },
})

export const { setAllPosts, setLikedArr, setAllComments } = postSlice.actions
export default postSlice.reducer
