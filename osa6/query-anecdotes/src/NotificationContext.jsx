import { createContext, useReducer, useContext } from 'react'
import PropTypes from 'prop-types';
const notificationReducer = (state, action) => {
  switch (action.type) {
    case "MESSAGE":
        return action.payload
    default:
        return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [message, notificationDispatch] = useReducer(notificationReducer, '')

  return (
    <NotificationContext.Provider value={[message, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}
NotificationContextProvider.propTypes = {
  children: PropTypes.node
};

export const useNotificationValue = () => {
    const messageAndDispatch = useContext(NotificationContext)
    return messageAndDispatch[0]
}
  
export const useNotificationDispatch = () => {
    const messageAndDispatch = useContext(NotificationContext)
    return messageAndDispatch[1]
}

export default NotificationContext