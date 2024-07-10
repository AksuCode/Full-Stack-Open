import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useReducer } from 'react'

import { updateAnecdote } from './services/anecdotes'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes } from './services/anecdotes'

import NotificationContext, { notificationReducer } from './reducers/notification'

const App = () => {

  const [message, notificationDispatch] = useReducer(notificationReducer, null)

  const queryClient = useQueryClient()

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1})
    notificationDispatch({type: 'SET_NOTIFICATION', content: `anecdote '${anecdote.content}' voted`})
    setTimeout(() => notificationDispatch({type: 'SET_NOTIFICATION', content: null}), 5000)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: () => getAnecdotes()
  })

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  if ( result.isError ) {
    return (<b>anecdote service not available due to problems in server</b>)
  }

  const anecdotes = result.data

  return (
    <NotificationContext.Provider value={[message, notificationDispatch]}>
      <div>
        <h3>Anecdote app</h3>
      
        <Notification />
        <AnecdoteForm />
      
        {anecdotes.map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => handleVote(anecdote)}>vote</button>
            </div>
          </div>
        )}
      </div>
    </NotificationContext.Provider>
  )
}

export default App
