import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        newNotification(state, action) {
            return action.payload
        },
        removeNotification(state, action) {
            return null
        },
    },
})

export const { newNotification, removeNotification } = notificationSlice.actions

export const setNotification = (message, durationSeconds = 1) => {
    return async (dispatch) => {
        dispatch(newNotification(message))
        setTimeout(() => {
            dispatch(removeNotification())
        }, durationSeconds * 1000)
    }
}

export default notificationSlice.reducer