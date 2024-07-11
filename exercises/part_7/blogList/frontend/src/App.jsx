import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'

import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'

import { setNotification } from './reducers/notificationReducer'
import { setBlogs, updateBlog, addBlog } from './reducers/blogsReducer'
import { setUser, deleteUser } from './reducers/userReducer'

const App = () => {

  const dispatch = useDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch(setUser(user))
      blogService.getAll().then(blogs =>
        dispatch(setBlogs(blogs))
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
        dispatch(setBlogs(blogs))
      )
      userService.getUserByUsername(user.username).then(user => 
        setName(user.name)
      )
      window.localStorage.setItem('loggedUser', JSON.stringify(user)) 
      blogService.setToken(user.token)
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(setNotification('Wrong username or password', 3))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    dispatch(deleteUser())
    setName('')
  }

  const handleLike = (blogObject) => {
    const creator = blogObject.user
    blogService
      .like(blogObject)
      .then(blog => {
        const tmpBlog = blog
        tmpBlog.user = creator
        dispatch(updateBlog(tmpBlog))
        dispatch(setNotification(`Liked blog ${tmpBlog.title}`, 3))
      })
      .catch(error => {
        dispatch(setNotification('Liking blog failed', 3))
      })
  }

  const handleDelete = (blogObject) => {
    if (window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)) {
      blogService
        .deleteBlog(blogObject)
        .then(response => {
          dispatch(setBlogs(blogs.filter(blog => blog.id !== blogObject.id)))
          dispatch(setNotification(`Blog ${blogObject.title} deleted`, 3))
        })
        .catch(error => {
          dispatch(setNotification('Could not delete blog. You might not be authorized.', 3))
        })
    }
  }

  const createBlog = (newBlog) => {
    blogService
      .create(newBlog)
      .then(addedBlog => {
        const tmpBlog = addedBlog
        tmpBlog.user = {username:user.username, name:user.name}
        dispatch(addBlog(tmpBlog))
        dispatch(setNotification(`a new blog ${tmpBlog.title} by ${tmpBlog.author} added`, 3))
      })
      .catch(error => {
        dispatch(setNotification('Failed to add blog', 3))
      })
  }

  const loginForm = () => (
    <>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            data-testid={'username'}
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            data-testid={'password'}
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button data-testid={'loginButton'} type="submit">login</button>
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
      {
      blogs
        //.sort((blogA, blogB) => blogB.likes - blogA.likes)
        .map(blog => {
          return <Blog key={blog.id} blog={blog} like={handleLike} deleteBlog={handleDelete} createdByThisUser={blog.user.username === user.username}/>
        }
        )
      }
    </>
  )

  return (
    <div>
      <Notification/>
      {user === null && loginForm()}
      {user !== null && displayBlogs()}
    </div>
  )
}

export default App