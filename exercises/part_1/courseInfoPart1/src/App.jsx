const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Content = (props) => {
  return (
    <div>
      <p>{props.parts[0]} {props.enumbs[0]}</p>
      <p>{props.parts[1]} {props.enumbs[1]}</p>
      <p>{props.parts[2]} {props.enumbs[2]}</p>
    </div>
  )
}

const Total = (props) => {
  return (
    <p>Number of exercises {props.total[0] + props.total[1] + props.total[2]}</p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course}/>
      <Content parts={[part1, part1, part3]} enumbs={[exercises1, exercises2, exercises3]}/>
      <Total total={[exercises1, exercises2, exercises3]}/>
    </div>
  )
}

export default App