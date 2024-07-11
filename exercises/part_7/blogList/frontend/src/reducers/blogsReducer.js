import { createSlice } from '@reduxjs/toolkit'

const blogsSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        setBlogs(state, action) {
            return action.payload
        },
        addBlog(state, action) {
            return state.concat(action.payload)
        },
        updateBlog(state, action) {
            const blog = action.payload
            return state.map(blogIt => {if (blogIt.id === blog.id) {return blog} else blogIt})
        }
    },
})

export const { addBlog, setBlogs, updateBlog } = blogsSlice.actions

export default blogsSlice.reducer