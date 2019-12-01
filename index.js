const express = require('express');
const app = express(); 

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
    name: "Stephen Zedd",
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



/* -- SERVER -- */
const PORT = 3001;
app.listen(PORT, console.log(`Running server on port ${PORT}`))