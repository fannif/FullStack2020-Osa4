const mongoose = require('mongoose')

if ( process.argv.length < 3 ) {
  console.log('Give password as an argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.ezjxj.mongodb.net/blogilista?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })