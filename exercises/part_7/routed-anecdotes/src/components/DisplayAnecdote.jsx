import { useParams } from "react-router-dom"

const DisplayAnecdote = ({ anecdotes }) => {

    const id = useParams().id
    const anecdote = anecdotes.find(anecdote => Number(anecdote.id) === Number(id))

    return(
        <div>
            <h2>{anecdote.content}</h2>
            <p>has {anecdote.votes} votes</p>
            <p>for more info see <a href={anecdote.info}>{anecdote.info}</a></p>
        </div>
    )
}

export default DisplayAnecdote