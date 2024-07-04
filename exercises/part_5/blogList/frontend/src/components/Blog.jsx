import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, like, deleteBlog, createdByThisUser }) => {

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className={'blog'}>
      <div style={hideWhenVisible} className={'blogVisibilityDefault'}>
        {blog.title} {blog.author}<button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible} className={'blogVisibilityExtended'}>
        <div>{blog.title} {blog.author}<button onClick={toggleVisibility}>hide</button></div>
        <div>{blog.url}</div>
        <div>{blog.likes}<button onClick={() => like(blog)}>like</button></div>
        <div>{blog.user.name}</div>
        {createdByThisUser && <button onClick={() => deleteBlog(blog)}>delete</button>}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  like: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  createdByThisUser: PropTypes.bool.isRequired
}

export default Blog