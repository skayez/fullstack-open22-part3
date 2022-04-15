const createNew = () => {
  const persons = People({
    id: Math.floor(Math.random() * 1000000),
    name: process.argv[3],
    number: process.argv[4],
  })
    
  persons.save().then(value => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })
}

const showDetails = () => {
  People
    .find({})
    .then(value => {
      console.log('phonebook:')
      value.forEach(value => {
        console.log(`${value.name} ${value.number}`)
        mongoose.connection.close()
    })
  })
}

const mongoose = require('mongoose')

const password = process.argv[2]
const url = `mongodb+srv://whatever:${password}@cluster0.epmhi.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personsSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
})

const People = mongoose.model('Person', personsSchema)

if (process.argv.length === 5) {
  createNew()
} else if (process.argv.length === 3) {
  showDetails()
} else {
  console.log('Connection to MongoDB Cloud failed.')
  process.exit(1)
}