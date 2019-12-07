// All we need is to export the mongoose model
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


const url = process.env.MONGODB_URI;

/* -- Connect -- */
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then( (result) => {
    console.log('Connected to MongoDB');
  })
  .catch( (error) => {
    console.log('Error connecting to MongoDB', error.message);
  });

/* -- Schema -- */
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  number: {
    type: String,
    required: true,
    minlength: 8,
  },
});

personSchema.plugin(uniqueValidator/* , { type: 'mongoose-unique-validator'} */);


/* -- Removing _id and __v from the object -- */
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

/* -- Model -- */
module.exports = mongoose.model('Person', personSchema);



