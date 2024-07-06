import { useState } from 'react'

const BlogForm = ({createBlog}) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')
  
    const addBlog = (event) => {
      event.preventDefault()
      
      const newBlog = {
        title: title,
        author: author,
        url: url
      }
  
      createBlog(newBlog)
  
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  
    return(
      <>
        <h2>Create new</h2>
        <form onSubmit={addBlog}>
          <div>
            title:
            <input data-testid={'title'} type="text" value={title} onChange={({target}) => setTitle(target.value)}/>
          </div>
          <div>
            author:
            <input data-testid={'author'} type="text" value={author} onChange={({target}) => setAuthor(target.value)}/>
          </div>
          <div>
            url:
            <input data-testid={'url'} type="text" value={url} onChange={({target}) => setUrl(target.value)}/>
          </div>
          <button data-testid={'blogCreateButton'} type="submit">create</button>
        </form>
      </>
    )
  
}

export default BlogForm