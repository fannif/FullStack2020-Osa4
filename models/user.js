const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
mongoose.set('useCreateIndex', true)

const userSchema = mongoose.Schema({
    username: {
        type: String, required: true, minlength: 3, unique: true
    },
    name: String,
    passwordHash: {
        type: String, required: true
    },
    blogs: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Blog'
        }
    ]
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedUser) => {
    returnedUser.id = returnedUser._id.toString()
    delete returnedUser._id
    delete returnedUser.__v
    delete returnedUser.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)