const Header3 = ({ text }) => <h3>{text}</h3>

const Total = ({ sum }) => <b>total of {sum} exercises</b>

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

export default Course