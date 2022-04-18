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
  id: Object,
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    minlength: 8,
    required: true,
    validate: {
      validator: /^\d{2}-(?=\d*$)|^\d{3}-(?=\d*$)/
    }
  }
})

personsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.__v
    delete returnedObject._id
  }
})

module.exports = mongoose.model('Person', personsSchema)