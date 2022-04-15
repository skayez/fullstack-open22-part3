const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(result => {
    console.log('connecting')
  })
  .catch((error) => {
    console.log('error', error.message)
  })

const personsSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
})

personsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personsSchema)