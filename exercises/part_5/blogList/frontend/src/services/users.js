import axios from 'axios'
const baseUrl = '/api/users'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const getUserByUsername = (username) => {
    return getAll().then(users => users.find(user => user.username === username))
}

export default { getAll, getUserByUsername }