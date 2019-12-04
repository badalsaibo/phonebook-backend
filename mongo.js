const mongoose = require('mongoose');

const password = process.argv[2];

// CHECKING FOR VALIDITY
if (process.argv.length > 3 && process.argv.length < 5) {
  console.log('To add person: node mongo.js <password> <contact-name> <contact-number>');
  console.log('To retreive note: node mongo.js <password>');
  process.exit(1);
}

// STORING ARGUMENTS INTO VARIABLES
const contactName = process.argv[3];
const contactNumber = process.argv[4];

// URI FOR THE DATABASE
const uri = `mongodb+srv://heyDante:${password}@cluster0-4riut.mongodb.net/phonebook?retryWrites=true&w=majority`;

// OPENING CONNECTION
mongoose
  .connect(uri, { useNewUrlParser: true})
  .catch( (error) => console.log(error.name))

// DEFINING A SCHEMA
const personSchema = mongoose.Schema({
  name: String,
  number: String,
});

// CREATING MODEL FROM SCHEMA
const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  Person
    .find({})
    .then( (persons) => {
      console.log('phonebook:');
      persons.forEach( (person) => {
        console.log(`${person.name} ${person.number}`);
      });
      mongoose.connection.close();
      process.exit(); // else the code still runs after this block.
    })
}

// CREATING A DOCUMENT
const person = new Person({
  name: contactName,
  number: contactNumber
})

// SAVING DOCUMENT TO DATABASE
person.save()
  .then( (response) => {
    console.log(`Added ${response.name} number ${response.number} to phonebook`)
    // CLOSING CONNECTION
    mongoose.connection.close();
  })