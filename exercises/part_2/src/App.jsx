const Header1 = ({ text }) => <h1>{text}</h1>

const Header3 = ({ text }) => <h3>{text}</h3>

const Total = ({ sum }) => <h4>total of {sum} exercises</h4>

const Course = ({course}) => {

  const sum = course.parts.reduce((sum, obj) => sum += obj.exercises, 0)

  return (
    <>
      <Header3 text={course.name}/>
        {
          course.parts.map(part =>
            <p key={part.id}>{part.name} {part.exercises}</p>
          )
        }
      <Total sum={sum}/>
    </>
  )
}

const Courses = ({courses}) => {
  return (
    <>
      {courses.map(course => <Course course={course}/>)}
    </>
  )
}

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      <Header1 text='Web development curriculum'/>
      <Courses courses={courses}/>
    </div>
  )
}

export default App