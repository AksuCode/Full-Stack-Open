import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = (newBlog, user) => {
  const config = {
    headers: {Authorization: token}
  }

  return axios.post(baseUrl, newBlog, config).then(response => response.data)
}

const like = (blogObject) => {
  const requestObject = {
    user: blogObject.user.id,
    likes: blogObject.likes + 1,
    author: blogObject.author,
    title: blogObject.title,
    url: blogObject.url
  }

  const requestURL = `${baseUrl}/${blogObject.id}`

  return axios.put(requestURL, requestObject).then(response => response.data)
}

const deleteBlog = (blogObject) => {
  const config = {
    headers: {Authorization: token}
  }

  const requestURL = `${baseUrl}/${blogObject.id}`

  return axios.delete(requestURL, config).then(response => response)
}

export default { getAll, setToken, create, like, deleteBlog }