import { useState, useEffect } from 'react'

import personService from './services/persons'

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

const Persons = ({persons, filter, deleteHandler}) => (
  <div>
    {persons.filter(person => person.name.toLowerCase().slice(0, filter.length) === filter.toLowerCase()).map(person => 
      <div key={person.id}>{person.name} {person.number} <button onClick={() => deleteHandler(person.name, person.id)}>delete</button></div>
    )}
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumb, setNewNumb] = useState('')
  const [newFilt, setNewFilt] = useState('')

  const hook = () => {
    personService.getAll()
    .then(response => {
      setPersons(response.data)
    })
  }

  useEffect(hook, [])

  const addPerson = (event) => {
    // Make number addition entirely server side (It is easier to let server generate ids). 2.12

    //event.preventDefault()
    
    const newPerson = {name:newName, number:newNumb}
    if (persons.map(obj => obj.name).includes(newPerson.name)) {
      if (window.confirm(`${newName} is alredy added to phonebook. Replace the old number with a new one?`)) {
        const oldPerson = persons.find(person => person.name === newName)
        personService.changeNumber(oldPerson, newNumb)
      }
    } else {
      // setPersons(persons.concat(newPerson))
      personService.create(newPerson)
    }

    setNewName('')
    setNewNumb('')
  }

  const deletePerson = (name, id) => {
    if (window.confirm(`Delete ${name}?`)) {
      const newPersons = persons.filter(person => person.id !== id)
      setPersons(newPersons)
      personService.deleteUsingID(id)
    }
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
      <Persons persons={persons} filter={newFilt} deleteHandler={deletePerson}/>
    </div>
  )
}

export default App