const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((total, blog) => {return (total + blog.likes)}, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.toSorted((blogA, blogB) => blogB.likes - blogA.likes)[0]
}

const mostBlogs = (blogs) => {
    const authorsOfBlogs = blogs.map((blog) => blog.author)

    const authorCount = []

    authorsOfBlogs.forEach((tmpAuthor) => {
        const index = authorCount.findIndex((authObj) => authObj.author === tmpAuthor)
        if (index !== -1) authorCount[index].blogs++
        else  authorCount.push({author:tmpAuthor, blogs:1})
    })

    return authorCount.toSorted((authorA, authorB) => authorB.blogs - authorA.blogs)[0]
}

const mostLikes = (blogs) => {

    const authorLikes = []

    blogs.map((blog) => ({author:blog.author, likes:blog.likes})).forEach((obj) => {

        const index = authorLikes.findIndex((authObj) => authObj.author === obj.author)

        if (index !== -1) {authorLikes[index].likes += obj.likes}
        else  authorLikes.push({author:obj.author, likes:obj.likes})

    })

    return authorLikes.toSorted((authorA, authorB) => authorB.likes - authorA.likes)[0]
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}