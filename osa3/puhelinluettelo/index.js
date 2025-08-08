
const express = require('express')
const app = express()
const cors = require('cors') 

var morgan = require('morgan')

//app.use(morgan('tiny'))

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

 let data = [
    {
      name: "Arto Hellas",
      number: "040-123456",
      id: "1"
    },
    {
      name: "Ada Lovelace",
      number: "39-44-5323523",
      id: "2"
    },
    {
      name: "Dan Abramov",
      number: "12-43-234345",
      id: "3"
    },
    {
      name: "Mary Poppendieck",
      number: "39-23-6423122",
      id: "4"
    }
]

app.get('/api/persons', (request, response) => {
  response.json(data)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = data.find(person => person.id === id)
    if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  data = data.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/info', (request, response) => {
    const count = data.length
    const date = new Date().toString()
    const info = `Phonebook has info for ${count} people\n${date}`
  
    response.send(info)
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  const personExists = data.find((person) => {
    if (person.name === body.name) {
        return true
    }
  })

  if (personExists) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
  
  const person = {
    name: body.name,
    number: body.number,
    id: '' + Math.floor(Math.random(1) * 10000000000),
  }

  data = data.concat(person)

  response.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
