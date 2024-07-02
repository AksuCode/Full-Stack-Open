import { useState, useEffect } from 'react'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [user, setUser] = useState(null)
  const [notif, setNotif] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )
      userService.getUserByUsername(user.username).then(user => 
        setName(user.name)
      )
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
    console.log('Logged out')
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    setName('')
  }

  const handleLike = (blogObject) => {
    blogService
      .like(blogObject)
      .then(response => {
        let likedBlogTitle = ''
        const modifiedBlogs = blogs.map(mblog => {
          if (mblog.id === blogObject.id) {
            likedBlogTitle = mblog.title
            const tmpBlog = mblog
            tmpBlog.likes = response.likes
            return tmpBlog
          }
          return mblog
        })
        setBlogs(modifiedBlogs)
        setNotif(`Liked blog ${likedBlogTitle}`)
      })
      .catch(error => {
        setNotif(`Liking blog failed`)
      })
  }

  const handleDelete = (blogObject) => {
    if (window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)) {
      blogService
        .deleteBlog(blogObject)
        .then(response => {
          setBlogs(blogs.filter(blog => blog.id !== blogObject.id))
          setNotif(`Blog ${blogObject.title} deleted`)
        })
        .catch(error => {
          setNotif("Could not delete blog. You might not be authorized.")
        })
    }
  }

  const createBlog = (newBlog) => {
    blogService
      .create(newBlog)
      .then(addedBlog => {
        const tmpBlog = addedBlog
        tmpBlog.user = {name:user.name}
        setBlogs(blogs.concat(tmpBlog))
        setNotif(`a new blog ${tmpBlog.title} by ${tmpBlog.author} added`)
      })
      .catch(error => {
        setNotif(`Failed to add blog`)
      })
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
      <Togglable buttonLabel={'new blog'}>
        <BlogForm createBlog={createBlog}/>
      </Togglable>
      {blogs
        .sort((blogA, blogB) => blogB.likes - blogA.likes)
        .map(blog => 
          <Blog key={blog.id} blog={blog} like={handleLike} deleteBlog={handleDelete} createdByThisUser={blog.user.username === user.username}/>
        )
      }
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