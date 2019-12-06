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

app.get('/api/persons/info', (req, res) => {
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

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then( (result) => {
      res.status(204).end();
    })
    .catch( (error) => {
      next(error); // Use our custom error-handler function
    })
});

/* -- POST -- */

app.post('/api/persons', (req, res) => {
  const body = req.body; // The object received from frontend
  if (!(body.number) ||  (!body.name)) {
    return res.status(400).json({
      error: 'name or number is missing'
    })
  };

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save()
    .then( (savedPerson) => {
      res.json(savedPerson);
    })
});

/* -- PUT -- */

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;

  const person = {
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then( (updatedPerson) => {
      if (updatedPerson) {
        res.json(updatedPerson.toJSON());
      } else {
        res.send({ error: 'mismatched id'}).end();
      }
    })
    .catch( (error) => {
      next(error);
    })
});

/* -- ERROR-HANDLER -- */

const errorHandler = (error, req, res, next) => {
  console.log(error.message);
  if(error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(404).send({ error: 'malformatted id'});
  } else {
    next(error);    // else use the express default error-handler
  }
};

app.use(errorHandler);

/* -- SERVER -- */

const PORT = process.env.PORT;
app.listen(PORT, console.log(`Running server on port ${PORT}`));