import { useDispatch } from 'react-redux'
import { createNewAnecdote } from '../reducers/anecdoteReducer.js'
import Notification from './Notification.jsx'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
    const dispatch = useDispatch()
    const newAnecdote = async (event) => {
        event.preventDefault()
        const anecdoteContent = event.target.new_anecdote.value
        event.target.new_anecdote.value = ''
        dispatch(createNewAnecdote(anecdoteContent))
        dispatch(setNotification(`you created ${anecdoteContent}`, 10))
    }

    return (
        <>
            <Notification  />
            <h2>create new</h2>
            <form onSubmit={newAnecdote}>
                <div><input name="new_anecdote" /></div>
                <button>create</button>
            </form>
        </>
    )
}
export default AnecdoteForm
