import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('form calls event handler with right details', async () => {

    const createBlog = vi.fn()

    render(<BlogForm createBlog={createBlog}/>)

    const user = userEvent.setup()

    const inputs = screen.getAllByRole('textbox')
    const button = screen.getByText('create')

    await user.type(inputs[0], 'Blog Title')
    await user.type(inputs[1], 'Blog Author')
    await user.type(inputs[2], 'Blog URL')
    await user.click(button)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toStrictEqual({ title: 'Blog Title', author: 'Blog Author', url: 'Blog URL' })

})