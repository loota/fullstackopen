import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer.js'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(({ filter, anecdotes }) => {
        console.log(filter)
        if (filter.text === '') {
            return anecdotes
        }
        return anecdotes.filter((anecdote) => { return anecdote.content.match(filter.text) })
    })
    const dispatch = useDispatch()

    const vote = (anecdote) => { 
        dispatch(addVote(anecdote))
        dispatch(setNotification(`you voted '${anecdote.content}'`, 10))
    }

    return (
        <>
            {anecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote)}>vote</button>
                    </div>
                </div>
        
            )}
        </>
    )
}

export default AnecdoteList
