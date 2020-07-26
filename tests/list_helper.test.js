const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ]

    const listWithManyBlogs = [
        {
          _id: '5a422aa71b54a676234d17f8',
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
          likes: 5,
          __v: 0
        },
        {
          _id: '5a422aa71b54a676234d17f9',
          title: 'Another blog',
          author: 'Test Author',
          url: 'http://www.testblog.fi',
          likes: 7,
          __v: 0
        },
        {
          _id: '5a422aa71b54a676234d17f0',
          title: 'Final blog',
          author: 'Test Author Final',
          url: 'http://www.testblogi2.fi',
          likes: 3,
          __v: 0
        },
        {
          _id: '5a422aa71b54a676234d17f1',
          title: 'The Blog',
          author: 'Test Author Again',
          url: 'http://www.testblogi3.fi',
          likes: 4,
          __v: 0
        }
    ]
  
    test('when list has a single blog is equal to its likes', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      expect(result).toBe(5)
    })

    test('is the sum of likes when multible blogs', () => {
      const result = listHelper.totalLikes(listWithManyBlogs)
      expect(result).toBe(19)
    })

    test('when list is empty is zero', () => {
      const result = listHelper.totalLikes([])
      expect(result).toBe(0)
    })

    test('is zero if given list is null', () => {
        const result = listHelper.totalLikes(null)
        expect(result).toBe(0)
    })

  })

  describe('favorite blog', () => {
    const listWithOneBlog = [
        {
          _id: '5a422aa71b54a676234d17f8',
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
          likes: 5,
          __v: 0
        }
      ]
  
      const listWithManyBlogs = [
          {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
          },
          {
            _id: '5a422aa71b54a676234d17f9',
            title: 'Another blog',
            author: 'Test Author',
            url: 'http://www.testblog.fi',
            likes: 7,
            __v: 0
          },
          {
            _id: '5a422aa71b54a676234d17f0',
            title: 'Final blog',
            author: 'Test Author Final',
            url: 'http://www.testblogi2.fi',
            likes: 3,
            __v: 0
          },
          {
            _id: '5a422aa71b54a676234d17f1',
            title: 'The Blog',
            author: 'Test Author Again',
            url: 'http://www.testblogi3.fi',
            likes: 4,
            __v: 0
          }
      ]

      const listWithSameLikes = [
          {
            _id: '5a422aa71b54a676234d17f9',
            title: 'Another blog',
            author: 'Test Author',
            url: 'http://www.testblog.fi',
            likes: 7,
            __v: 0
          },
          {
            _id: '5a422aa71b54a676234d17f0',
            title: 'Final blog',
            author: 'Test Author Final',
            url: 'http://www.testblogi2.fi',
            likes: 7,
            __v: 0
          },
          {
            _id: '5a422aa71b54a676234d17f1',
            title: 'The Blog',
            author: 'Test Author Again',
            url: 'http://www.testblogi3.fi',
            likes: 7,
            __v: 0
          }
      ]

      test('is the only blog if there is only one on the list', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        const expectedResult = {
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          likes: 5
        }
        expect(result).toEqual(expectedResult)
      })

      test('is the one with most likes in a list of many', () => {
        const result = listHelper.favoriteBlog(listWithManyBlogs)
        const expectedResult = {
            title: 'Another blog',
            author: 'Test Author',
            likes: 7
        }
        expect(result).toEqual(expectedResult)
      })

      test('is null if list is empty', () => {
          const result = listHelper.favoriteBlog([])
          expect(result).toEqual(null)
      })

      test('is null if list is null', () => {
        const result = listHelper.favoriteBlog(null)
        expect(result).toEqual(null)
      })

      test('is first one out of blogs with same amount of likes', () => {
        const result = listHelper.favoriteBlog(listWithSameLikes)
        const expectedResult = {
            title: 'Another blog',
            author: 'Test Author',
            likes: 7
          }
        expect(result).toEqual(expectedResult)
      })
  })

  describe('author with most blogs', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ]

    const listWithManyBlogs = [ 
        { 
            _id: "5a422a851b54a676234d17f7", 
            title: "React patterns", 
            author: "Michael Chan", 
            url: "https://reactpatterns.com/", 
            likes: 7, __v: 0 
        }, 
        { 
            _id: "5a422aa71b54a676234d17f8", 
            title: "Go To Statement Considered Harmful", 
            author: "Edsger W. Dijkstra", 
            url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", 
            likes: 5, 
            __v: 0 
        }, 
        { 
            _id: "5a422bc61b54a676234d17fc", 
            title: "Type wars", 
            author: "Robert C. Martin", 
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", 
            likes: 2, 
            __v: 0 
        },
        { 
            _id: "5a422ba71b54a676234d17fb", 
            title: "TDD harms architecture", 
            author: "Robert C. Martin", 
            url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", 
            likes: 0, 
            __v: 0 
        }, 
        { 
            _id: "5a422b3a1b54a676234d17f9", 
            title: "Canonical string reduction", 
            author: "Edsger W. Dijkstra", 
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", 
            likes: 12, 
            __v: 0 
        }, 
        { 
            _id: "5a422b891b54a676234d17fa", 
            title: "First class tests", 
            author: "Robert C. Martin", 
            url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", 
            likes: 10, 
            __v: 0 
        }
    ]

    const listWithTwoBlogsFromDifferentAuthors = [
        { 
            _id: "5a422ba71b54a676234d17fb", 
            title: "TDD harms architecture", 
            author: "Robert C. Martin", 
            url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", 
            likes: 0, 
            __v: 0 
        }, 
        { 
            _id: "5a422b3a1b54a676234d17f9", 
            title: "Canonical string reduction", 
            author: "Edsger W. Dijkstra", 
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", 
            likes: 12, 
            __v: 0 
        }
    ]
  
    test('has one blog with their name if only one blog on the list', () => {
      const result = listHelper.mostBlogs(listWithOneBlog)
      const expectedResult = { author: 'Edsger W. Dijkstra', blogs: 1 }
      expect(result).toEqual(expectedResult)
    })

    test('has correct name and amount of blogs if list has many blogs and multiple authors', () => {
        const result = listHelper.mostBlogs(listWithManyBlogs)
        const expectedResult = { author: 'Robert C. Martin', blogs: 3 }
        expect(result).toEqual(expectedResult)
    })

    test('is the one who comes first alphabethically if multiple with most blogs', () => {
        const result = listHelper.mostBlogs(listWithTwoBlogsFromDifferentAuthors)
        const expectedResult = { author: 'Edsger W. Dijkstra', blogs: 1 }
        expect(result).toEqual(expectedResult)
    })

    test('is null if list is empty', () => {
        const result = listHelper.mostBlogs([])
        expect(result).toEqual(null)
    })

    test('is null if list is null', () => {
        const result = listHelper.mostBlogs(null)
        expect(result).toEqual(null)
    })
  })


  describe('author with most likes', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ]

    const listWithManyBlogs = [ 
        { 
            _id: "5a422a851b54a676234d17f7", 
            title: "React patterns", 
            author: "Michael Chan", 
            url: "https://reactpatterns.com/", 
            likes: 7, 
            __v: 0 
        }, 
        { 
            _id: "5a422aa71b54a676234d17f8", 
            title: "Go To Statement Considered Harmful", 
            author: "Edsger W. Dijkstra", 
            url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", 
            likes: 5, 
            __v: 0 
        }, 
        { 
            _id: "5a422bc61b54a676234d17fc", 
            title: "Type wars", 
            author: "Robert C. Martin", 
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", 
            likes: 2, 
            __v: 0 
        },
        { 
            _id: "5a422ba71b54a676234d17fb", 
            title: "TDD harms architecture", 
            author: "Robert C. Martin", 
            url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", 
            likes: 0, 
            __v: 0 
        }, 
        { 
            _id: "5a422b3a1b54a676234d17f9", 
            title: "Canonical string reduction", 
            author: "Edsger W. Dijkstra", 
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", 
            likes: 12, 
            __v: 0 
        }, 
        { 
            _id: "5a422b891b54a676234d17fa", 
            title: "First class tests", 
            author: "Robert C. Martin", 
            url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", 
            likes: 10, 
            __v: 0 
        }
    ]

    const listWithTwoBlogsFromDifferentAuthors = [
        { 
            _id: "5a422ba71b54a676234d17fb", 
            title: "TDD harms architecture", 
            author: "Robert C. Martin", 
            url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", 
            likes: 12, 
            __v: 0 
        }, 
        { 
            _id: "5a422b3a1b54a676234d17f9", 
            title: "Canonical string reduction", 
            author: "Edsger W. Dijkstra", 
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", 
            likes: 12, 
            __v: 0 
        }
    ]
  
    test('is the author of the only blog and its number of likes if only one blog', () => {
      const result = listHelper.mostLikes(listWithOneBlog)
      const expectedResult = { author: 'Edsger W. Dijkstra', likes: 5 }
      expect(result).toEqual(expectedResult)
    })

    test('has correct name and likes if list has many blogs and multiple authors', () => {
        const result = listHelper.mostLikes(listWithManyBlogs)
        const expectedResult = { author: 'Edsger W. Dijkstra', likes: 17 }
        expect(result).toEqual(expectedResult)
    })

    test('is the one who comes first alphabethically if multiple with most likes', () => {
        const result = listHelper.mostLikes(listWithTwoBlogsFromDifferentAuthors)
        const expectedResult = { author: 'Edsger W. Dijkstra', likes: 12 }
        expect(result).toEqual(expectedResult)
    })

    test('is null if list is empty', () => {
        const result = listHelper.mostLikes([])
        expect(result).toEqual(null)
    })

    test('is null if list is null', () => {
        const result = listHelper.mostLikes(null)
        expect(result).toEqual(null)
    })
  })