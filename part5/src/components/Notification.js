const Notification = ({ message, type }) => { // type in { 'success', 'error' }
  if (!message) {
    return null
  }
  return <div className={type}>{message}</div>
}

export default Notification
