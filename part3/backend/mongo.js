const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

if (process.argv.length > 5 || process.argv.length === 4) {
  // invalid arguments
  console.log('Invalid program arguments provided, either supply data for new entry or nothing to fetch all the phonebook entries.')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.vzqrwoc.mongodb.net/Phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)


if (process.argv.length === 3) {
  // retreive all the entries in the phonebook
  Person.find({}).then(result => {

    console.log('Phonebook:')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })


} else if (process.argv.length === 5) {
  // create a new phonebook entry

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}

