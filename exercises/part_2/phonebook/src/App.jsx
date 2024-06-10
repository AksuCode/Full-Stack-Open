import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({filterInput, filterInputHandler}) => (
  <form>
    <div>filter shown with<input value={filterInput} onChange={filterInputHandler}/></div>
  </form>
)

const PersonForm = ({personHandler, nameInput, nameInputHandler, numbInput, numbInputHandler}) => (
  <form onSubmit={personHandler}>
    <div>name: <input value={nameInput} onChange={nameInputHandler}/></div>
    <div>number: <input value={numbInput} onChange={numbInputHandler}/></div>
    <div><button type="submit">add</button></div>
  </form>
)

const Persons = ({persons, filter}) => (
  <div>
    {persons.filter(person => person.name.toLowerCase().slice(0, filter.length) === filter.toLowerCase()).map(person => 
      <p key={person.name}>{person.name} {person.number}</p>
    )}
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumb, setNewNumb] = useState('')
  const [newFilt, setNewFilt] = useState('')


  const hook = () => {
    axios
    .get('http://localhost:3001/persons')
    .then(response => {
      setPersons(response.data)
    })
  }

  useEffect(hook, [])

  const addPerson = (event) => {
    event.preventDefault()
    
    const newPerson = {name:newName, number:newNumb}
    if (persons.map(obj => obj.name).includes(newPerson.name)) {
      window.alert(`${newName} is alredy added to phonebook`)
    } else if (persons.map(obj => obj.number).includes(newPerson.number)) {
      window.alert(`${newNumb} is alredy added to phonebook`)
    } else {
      setPersons(persons.concat(newPerson))
    }

    setNewName('')
    setNewNumb('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumbChange = (event) => {
    setNewNumb(event.target.value)
  }

  const handleFiltChange = (event) => {
    setNewFilt(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterInput={newFilt} filterInputHandler={handleFiltChange}/>

      <h2>add a new</h2>
      <PersonForm personHandler={addPerson} nameInput={newName} nameInputHandler={handleNameChange} numbInput={newNumb} numbInputHandler={handleNumbChange}/>

      <h2>Numbers</h2>
      <Persons persons={persons} filter={newFilt}/>
    </div>
  )
}

export default App