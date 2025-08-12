const Notification = ({ message, error }) => {
  if (message === null) {
    return null
  }
  const notificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  if (error === true) {
    notificationStyle.color = 'red';
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

export default Notification