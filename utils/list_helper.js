const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    if (blogs === null || blogs.length === 0) {
        return 0
    }

    const sum = blogs.map(b => b.likes).reduce((a, b) => a + b)
    return sum
}

const favoriteBlog = (blogs) => {
    if (blogs === null || blogs.length === 0) {
        return null
    }

    var maxLikes = blogs[0].likes
    var index = 0

    for (var i = 1; i < blogs.length; i++) {
        if (blogs[i].likes > maxLikes) {
            maxLikes = blogs[i].likes
            index = i
        }
    }

    const favorite = {
      title: blogs[index].title,
      author: blogs[index].author,
      likes: blogs[index].likes
    }

    return favorite
}

const mostBlogs = (blogs) => {
    if (blogs === null || blogs.length === 0) {
        return null
    }

    blogs.sort(compareAuthor)
    var author = blogs[0].author
    var amount = 1
    var maxAmount = 1
    var index = 0

    for (var i = 1; i < blogs.length; i++) {
        if (blogs[i].author === author) {
            amount++
            if (amount > maxAmount) {
                index = i
                maxAmount = amount
            }
            continue
        }
        author = blogs[i].author
        amount = 1
    }

    return { author: blogs[index].author, blogs: maxAmount }
}

const compareAuthor = (a, b) => {
    const authorA = a.author.toUpperCase()
    const authorB = b.author.toUpperCase()
  
    var comparison = 0
    if (authorA > authorB) {
      comparison = 1
    } else if (authorA < authorB) {
      comparison = -1
    }
    return comparison
  }

const mostLikes = (blogs) => {
    if (blogs === null || blogs.length === 0) {
        return null
    }

    blogs.sort(compareAuthor)
    var author = blogs[0].author
    var amount = blogs[0].likes
    var maxAmount = blogs[0].likes
    var index = 0

    for (var i = 1; i < blogs.length; i++) {
        if (blogs[i].author === author) {
            amount += blogs[i].likes
            if (amount > maxAmount) {
                index = i
                maxAmount = amount
            }
            continue
        }
        author = blogs[i].author
        amount = blogs[i].amount
    }

    return { author: blogs[index].author, likes: maxAmount }
}
  
module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}