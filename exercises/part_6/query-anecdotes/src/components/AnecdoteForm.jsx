import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../services/anecdotes'

import { useContext } from 'react'
import NotificationContext from '../reducers/notification'

const AnecdoteForm = () => {

  const [message, notificationDispatch] = useContext(NotificationContext)

  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
    onError: () => {
      notificationDispatch({type: 'SET_NOTIFICATION', content: 'too short anecdote, must have length 5 or more'})
      setTimeout(() => notificationDispatch({type: 'SET_NOTIFICATION', content: null}), 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({content, votes: 0})
    notificationDispatch({type: 'SET_NOTIFICATION', content: `anecdote '${content}' added`})
    setTimeout(() => notificationDispatch({type: 'SET_NOTIFICATION', content: null}), 5000)
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
