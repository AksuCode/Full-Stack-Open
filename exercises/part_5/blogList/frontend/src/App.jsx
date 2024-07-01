import { useState, useEffect } from 'react'

import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notif, setNotif] = useState(null)

  useEffect(() => {
    console.log("Hook loaded")
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password
      })
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )
      userService.getUserByUsername(user.username).then(user => 
        setName(user.name)
      )
      window.localStorage.setItem('loggedUser', JSON.stringify(user)) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotif('Wrong username or password')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    setName('')
  }

  const handleBlogCreation = async (event) => {
    event.preventDefault()
    
    const newBlog = {
      title: title,
      author: author,
      url: url
    }

    const addedBlog = await blogService.create(newBlog)
    if (addedBlog) {
      setBlogs(blogs.concat(addedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setNotif(`a new blog ${addedBlog.title} by ${addedBlog.author} added`)
    } else {
      setNotif('Failed to add blog')
    }
  }

  const loginForm = () => (
    <>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>  
  )

  const displayBlogs = () => (
    <>
      <h2>blogs</h2>
      <p>{name} logged in<button type="submit" onClick={handleLogout}>logout</button></p>
      <form onSubmit={handleBlogCreation}>
        <div>
          title:
          <input type="text" value={title} onChange={({target}) => setTitle(target.value)}/>
        </div>
        <div>
          author:
          <input type="text" value={author} onChange={({target}) => setAuthor(target.value)}/>
        </div>
        <div>
          url:
          <input type="text" value={url} onChange={({target}) => setUrl(target.value)}/>
        </div>
        <button type="submit">create</button>
        </form>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </>
  )

  const displayNotification = () => {
    
    setTimeout(() => {
      setNotif(null)
    }, 5000)

    return (
      <>
        <div><b>{notif}</b></div>
      </>
    )

  }

  return (
    <div>
      {notif !== null && displayNotification()}
      {user === null && loginForm()}
      {user !== null && displayBlogs()}
    </div>
  )
}

export default App