const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Part = (props) => {
  return (
    <p>{props.part} {props.enumb}</p>
  )
}

const Content = (props) => {
  return (
    <div>
      <Part part={props.parts[0].name} enumb={props.parts[0].exercises}/>
      <Part part={props.parts[1].name} enumb={props.parts[1].exercises}/>
      <Part part={props.parts[2].name} enumb={props.parts[2].exercises}/>
    </div>
  )
}

const Total = (props) => {
  return (
    <p>Number of exercises {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises}</p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  return (
    <div>
      <Header course={course}/>
      <Content parts={[part1, part2, part3]}/>
      <Total parts={[part1, part2, part3]}/>
    </div>
  )
}

export default App