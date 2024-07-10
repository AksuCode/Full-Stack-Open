import { createContext} from 'react'

export const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
        return action.content
    default:
        return state
  }
}

const NotificationContext = createContext()

export default NotificationContext