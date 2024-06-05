import { useState } from 'react'

const Header = (props) => (
  <h1>{props.headerText}</h1>
)

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatisticLine = ({text, value, unit}) => (
  <tr><td>{text}</td><td>{value} {unit}</td></tr>
)

const Statistics = ({good, neutral, bad}) => {

  const numberOfFeedback = good + neutral + bad

  if (numberOfFeedback > 0) {
    return (
      <table>
        <tbody>
          <StatisticLine text="good" value={good}/>
          <StatisticLine text="neutral" value={neutral}/>
          <StatisticLine text="bad" value={bad}/>
          <StatisticLine text="all" value={numberOfFeedback}/>
          <StatisticLine text="average" value={(good - bad)/numberOfFeedback}/>
          <StatisticLine text="positive" value={100 * good/numberOfFeedback} unit='%'/>
        </tbody>
      </table>
    )
  } else {
    return <div>No feedback given</div>
  }

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