import { useSelector, useDispatch } from "react-redux"
import { anecdoteVote } from "../reducers/anecdoteReducer"
import { setNotification, removeNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {

    const rawAnecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector(state => state.filter)
    const anecdotes = rawAnecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
    const dispatch = useDispatch()

    const vote = (id, content) => {
        dispatch(anecdoteVote(id))
        dispatch(setNotification(`you voted '${content}'`))
        setTimeout(() => {dispatch(removeNotification())}, 5000)
    }

    return (
        <>
            {anecdotes.sort((anecdoteA, anecdoteB) => anecdoteB.votes - anecdoteA.votes).map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default AnecdoteList