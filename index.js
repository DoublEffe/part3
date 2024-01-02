const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()


app.use(express.json())
morgan.token('custom',(res)=> JSON.stringify(res.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :custom'))
app.use(cors())

var persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const date = new Date().toString()
  response.send(`<div><p>Phonebook has info for ${persons.length} persons</p><p>${date}</p></div>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if(person){
    response.json(person)
  }
  else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  let person = request.body
  let check = persons.find(perso => perso.name === person.name)
  if(!person.name || !person.number){
    response.status(400).json({error: 'name or number missing'})
  }
  else if(check){
    response.status(400).json({error: 'name must be unique'})
  }
  else{
    person.id = id
    persons = persons.concat(person)}
    response.json(persons)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})