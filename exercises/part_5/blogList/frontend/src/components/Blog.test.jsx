import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders correctly', () => {
    const blog = {
        title:'Test blog',
        author: 'tester',
        url: 'www.something.com',
        likes: 721,
        user: {name: 'someone'}
    }

    const {container} = render(<Blog blog={blog} like={() => {}} deleteBlog={() => {}} createdByThisUser={true}/>)

    const div = container.querySelector('.blog')

    expect(div).toHaveTextContent('Test blog')
    expect(div).toHaveTextContent('tester')
    expect(div.querySelector('.blogVisibilityExtended')).toHaveStyle('display: none')
})

test('show more blog details with button', async () => {
    const blog = {
        title:'Test blog',
        author: 'tester',
        url: 'www.something.com',
        likes: 721,
        user: {name: 'someone'}
    }

    const {container} = render(<Blog blog={blog} like={() => {}} deleteBlog={() => {}} createdByThisUser={true}/>)

    const div = container.querySelector('.blog')

    const user = userEvent.setup()

    expect(div.querySelector('.blogVisibilityExtended')).toHaveStyle('display: none')

    await user.click(screen.getByText('view'))

    expect(div.querySelector('.blogVisibilityExtended')).not.toHaveStyle('display: none')

})

test('clicking like button calls event handler', async () => {
    const blog = {
        title:'Test blog',
        author: 'tester',
        url: 'www.something.com',
        likes: 721,
        user: {name: 'someone'}
    }

    const mockLikeHandler = vi.fn()

    render(<Blog blog={blog} like={mockLikeHandler} deleteBlog={() => {}} createdByThisUser={true}/>)

    const user = userEvent.setup()

    expect(mockLikeHandler.mock.calls).toHaveLength(0)

    await user.click(screen.getByText('like'))
    await user.click(screen.getByText('like'))

    expect(mockLikeHandler.mock.calls).toHaveLength(2)

})
