import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { CommentType, LikedType, PostType } from '../../types/postType'

interface PostState {
    allPosts: PostType[],
    likedArr: LikedType[],
    allComments: CommentType[],
    searchedTab: "search" | "user" | "post",
    searchedQuery: string,
}

const initialState: PostState = {
    allPosts: [],
    likedArr: [],
    allComments: [],
    searchedTab: "post",
    searchedQuery: ""
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
        },
        setSearchedTab: (state, action: PayloadAction<"search" | "user" | "post">) => {
            state.searchedTab = action.payload
        },
        setSearchedQuery: (state, action: PayloadAction<string>) => {
            state.searchedQuery = action.payload
        },
    },
})

export const { setAllPosts, setLikedArr, setAllComments, setSearchedTab, setSearchedQuery } = postSlice.actions
export default postSlice.reducer
