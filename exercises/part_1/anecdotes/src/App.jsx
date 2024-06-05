import { useState } from 'react'

const DisplayHeader = (props) => (
  <h1>{props.text}</h1>
)

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const RandomCappedPosInt = (nonInclusiveMax) => (
  Math.floor(Math.random() * nonInclusiveMax)
)

const DisplayVote = (props) => (
  <div>has {props.vote} votes</div>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const arrayLength = anecdotes.length
   
  const [selected, setSelected] = useState(RandomCappedPosInt(arrayLength))
  const [votes, setVotes] = useState(new Array(arrayLength).fill(0))

  const changeState = () => {

    let newSelected = RandomCappedPosInt(arrayLength)

    while (selected === newSelected) {
      newSelected = RandomCappedPosInt(arrayLength)
    }

    setSelected(newSelected)
  }

  const incrementVote = () => {

    const copy = [...votes]

    copy[selected] += 1

    setVotes(copy)
  }

  const indexOfTopAnecdote = votes.indexOf(Math.max(...votes))

  return (
    <div>
      <DisplayHeader text='Anecdote of the day' />
      <div>{anecdotes[selected]}</div>
      <DisplayVote vote={votes[selected]}/>
      <div>
        <Button text='vote' handleClick={incrementVote}/>
        <Button text='next anecdote' handleClick={changeState}/>
      </div>
      <DisplayHeader text='Anecdote with most votes' />
      <div>{anecdotes[indexOfTopAnecdote]}</div>
      <DisplayVote vote={votes[indexOfTopAnecdote]}/>
    </div>
  )
}

export default App