import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer.js'
import Notification from './Notification.jsx'
import { notify, removeNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
    const dispatch = useDispatch()
    const newAnecdote = (event) => {
        event.preventDefault()
        const anecdoteContent = event.target.new_anecdote.value
        event.target.new_anecdote.value = ''
        dispatch(createAnecdote(anecdoteContent))
        dispatch(notify(`you created ${anecdoteContent}`))
        setTimeout(() => {
            dispatch(removeNotification())
        }, 5000)
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