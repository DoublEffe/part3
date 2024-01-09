require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/persons')
const errorHandler = require('./middleware/error')
const app = express()


app.use(express.json())
morgan.token('custom',(res) => JSON.stringify(res.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :custom'))
app.use(cors())
app.use(express.static('dist'))



app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(persons => response.json(persons))
})

app.get('/info', (request, response) => {
    const date = new Date().toString()
    Person.find({})
        .then(persons => response.send(`<div><p>Phonebook has info for ${persons.length} persons</p><p>${date}</p></div>`))
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(res => response.send(res))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(res => response.status(204).end())
        .catch(error => next(error))
  
})

app.post('/api/persons', (request, response, next) => {
    const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
    let person = request.body
    if(!person.name || !person.number){
        response.status(400).json({error: 'name or number missing'})
    }  
    else{
        person.id = id
        person = new Person({
            name: person.name, number: person.number
        })}
    person.save()
        .then(res => response.json(request.body))
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response) => {
    const person = request.body
    const updatedPerson = {
        name: person.name,
        number: person.number
    }
    Person.findByIdAndUpdate(request.params.id, updatedPerson, {new: true})
        .then(res => response.json(res))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})