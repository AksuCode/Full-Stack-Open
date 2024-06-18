import axios from 'axios'
const baseUrl = './api/persons/'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newObject => {
  return axios.post(baseUrl, newObject)
}

const deleteUsingID = id => {
  return axios.delete(baseUrl + id)
}

const changeNumber = (person, newNumber) => {
  const newPerson = person
  newPerson.number = newNumber
  return axios.put(baseUrl + person.id, newPerson)
}

export default {getAll, create, deleteUsingID, changeNumber}