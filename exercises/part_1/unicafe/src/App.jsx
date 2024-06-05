import { useState } from 'react'

const Header = (props) => (
  <h1>{props.headerText}</h1>
)

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const DisplayStat = ({stat, number, unit}) => (
  <div>{stat} {number} {unit}</div>
)

const Statistics = ({good, neutral, bad}) => {

  const numberOfFeedback = good + neutral + bad

  return (
    <div>
      <DisplayStat stat="good" number={good}/>
      <DisplayStat stat="neutral" number={neutral}/>
      <DisplayStat stat="bad" number={bad}/>
      <DisplayStat stat="all" number={numberOfFeedback}/>
      <DisplayStat stat="average" number={(good - bad)/numberOfFeedback}/>
      <DisplayStat stat="positive" number={good/numberOfFeedback} unit='%'/>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <Header headerText='Give feedback'/>
      <Button handleClick={handleGoodClick} text='Good'/>
      <Button handleClick={handleNeutralClick} text='Neutral'/>
      <Button handleClick={handleBadClick} text='Bad'/>
      <Header headerText='statistics'/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App