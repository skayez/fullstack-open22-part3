const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const morgan = require('morgan')
const Person = require('./models/persons')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(value => {
      res.json(value)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person
    .findById(req.params.id)
    .then(value => {
      if (value) {
        res.json(value)
      } else {
        res.status(404).end()
      }
    })
    .catch(value => next(value))
})

app.get('/info', (req, res) => {
  Person
    .find({})
    .then(value => {
      res.send(`<p>Phonebook has info for ${value.length} people</p><p>${new Date()}</p>`)
    })
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const persons = new Person({
    name: body.name,
    number: body.number,
  })
  
  persons.save()
    .then(value => {
      res.json(value)
    })
    .catch(value => next(value))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(value => {
      res.status(204).end()
    })
    .catch(value => next(value))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findByIdAndUpdate(req.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(value => {
      res.json(value)
    })
    .catch(value => next(value))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})