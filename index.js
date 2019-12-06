require('dotenv').config();
const express = require('express');
const app = express(); 
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

/* -- BODY-PARSER -- */
app.use(bodyParser.json()); // else req.body will be undefined


/* -- Enabling CORS -- */
app.use(cors());

/* -- Enabling Express to serve static content -- */
app.use(express.static('build'));

/* -- MORGAN -- */
morgan.token('body', (req, res) => {
  return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

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
}); // This is not being used now because '/' is used to hold static content;

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then( (persons) => {
      res.json(persons.map( (person) => person.toJSON()));
    });
});

app.get('/info', (req, res) => {
  Person.find({})
    .then( (persons) => {
      res.send(`
      Phonebook has info for ${persons.length} people
      <br>
      ${new Date()}
      `);
    });
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id; 

  Person.findById(id)
    .then( (person) => {
      res.json(person.toJSON());
    })
    .catch( (error) => {
      res.status(404).end();
    })
})

/* -- DELETE -- */
app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then( (result) => {
      res.status(204).end();
    })
    .catch( (error) => {
      console.log(error.message);
      res.status(404).send({ error: 'malformatted id'})
    })
});

/* -- POST -- */

app.post('/api/persons', (req, res) => {
  const body = req.body; // The object received from frontend
  if (!(body.number) ||  (!body.name)) {
    return res.status(400).json({
      error: 'name or number is missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save()
    .then( (savedPerson) => {
      res.json(savedPerson);
    })
});

/* -- SERVER -- */
const PORT = process.env.PORT;
app.listen(PORT, console.log(`Running server on port ${PORT}`));