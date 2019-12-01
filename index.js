const express = require('express');
const app = express(); 
const bodyParser = require('body-parser');

/* -- PERSONS -- */
let persons = [
  {
    name: "Stephen Zend",
    number: "469464-66",
    id: 1,
  },
  {
    name: "Riley Brooks",
    number: "34434-43",
    id: 2,
  },
  {
    name: "Justin Guill",
    number: "7878870-7878",
    id: 3,
  },
  {
    name: "Zelad Tedd",
    number: "5575-757575",
    id: 4,
  }
]

/* -- GET -- */
app.get('/', (req, res) => {
  res.send('<a href="/api/persons">/api/persons</a>');
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/info', (req, res) => {
  res.send(`
    Phonebook has info for ${persons.length} people
    <br>
    ${new Date()}
  `)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id); // else type if 'string'
  const person = persons.find( (person) => person.id === id );
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
})

/* -- DELETE -- */
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter( (person) => person.id !== id );
  res.status(204).end();
})

/* -- POST -- */
app.use(bodyParser.json());

const generateId = (max) => {
  return Math.floor(Math.random() * max);
}

app.post('/api/persons', (req, res) => {
  const person = req.body;
  person.id = generateId(1000);
  persons = persons.concat(person);
  res.json(person);
})

/* -- SERVER -- */
const PORT = 3001;
app.listen(PORT, console.log(`Running server on port ${PORT}`))