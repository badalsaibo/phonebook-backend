// All we need is to export the mongoose model
const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

/* -- Connect -- */
mongoose.connect(url, { useNewUrlParser: true })
  .then( (result) => {
    console.log('Connected to MongoDB');
  })
  .catch( (error) => {
    console.log('Error connecting to MongoDB', error.message);
  });

  /* -- Schema -- */
  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  });


  /* -- Removing _id and __v from the object -- */
  personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    }
  })

  /* -- Model -- */
module.exports = mongoose.model('Person', personSchema);



