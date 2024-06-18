require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.static('dist'))

app.use(express.json())

app.use(cors())

morgan.token('postContent', function (req, res) { if (req.method === 'POST') return JSON.stringify(req.body)})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postContent'))

app.get('/info', (request, response) => {

    let persons = []

    Person.find({}).then(result => {
        result.forEach(p => {
            persons = persons.concat(p)
        })
        const personsCount = persons.length
        const timeStamp = new Date()[Symbol.toPrimitive]('string')
    
        const responseString = `<p>Phonebook has info for ${personsCount} people</p><p>${timeStamp}</p>`
    
        response.send(responseString)
    })
})

app.get('/api/persons', (request, response) => {
    
    let persons = []

    Person.find({}).then(result => {
        result.forEach(p => {
            persons = persons.concat(p)
        })
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
          .then(result => {
            response.status(204).end()
          })
          .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({ 
          error: 'name missing' 
        })
    }

    if (!body.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
    }

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
          .then(updated => {
            response.json(updated)
          })
          .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({ 
          error: 'name missing' 
        })
    }

    if (!body.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save()
          .then( saved => {
            response.json(saved)
          })
          .catch(error => next(error))

})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
  
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})