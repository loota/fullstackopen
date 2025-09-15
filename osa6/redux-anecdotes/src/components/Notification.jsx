import { useSelector } from 'react-redux'
//import notify from '../reducers/notificationReducer'

const Notification = () => {
  const notification = useSelector(({notification}) => {
    return notification
  })
  if (notification === null || notification === '') {
    return null
  }
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification