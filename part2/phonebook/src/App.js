import { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = ({ message, type }) => { // type in { 'success', 'error' }
  if (message == null) {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}

const Person = ({ name, number, deletePerson }) => {
  return <p>{name} {number} <button onClick={deletePerson}>delete</button> </p>
}

const Persons = ({ persons, nameFilter, deletePerson }) => {

  // filter the persons based on the inclusion of the searched substring nameFilter
  const personsFiltered = persons.filter(
    person => person.name.toLowerCase().indexOf(nameFilter.toLowerCase()) > -1
  )

  return (
    <div>
      {personsFiltered.map(
        person => {
          return (
            <Person
              key={person.id}
              name={person.name}
              number={person.number}
              deletePerson={() => deletePerson(person.name, person.id)}
            />
          )
        }
      )}
    </div>
  )
}

const Filter = ({ value, onChangeHandler }) => {
  return (
    <div>
      filter by name: <input value={value} onChange={onChangeHandler}/>
    </div>
  )
}

const PersonForm = ({
  nameValue,
  numberValue,
  nameChangeHandler,
  numberChangeHandler,
  onSubmitHandler }) => {

  return (
    <form onSubmit={onSubmitHandler}>
      <div>
        name: <input value={nameValue} onChange={nameChangeHandler}/>
      </div>
      <div>
        number: <input value={numberValue} onChange={numberChangeHandler}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    console.log('effect')
    personService.getAll().then(data => {
      console.log('person fetch complete, promise fulfilled')
      console.log(data)
      setPersons(data)
    })
  }, [])


  const addPerson = (event) => {
    event.preventDefault()
    const name = newName.trim()
    const number = newNumber.trim()

    if (name !== '') {
      
      // check if the array already contains the new name
      if (persons.some(item => item.name.toLowerCase() == name.toLowerCase())) {

        if (window.confirm(`${name} is already in the phonebook ` + 
          `replace the old number with a new one?`)) {

          const oldPerson = persons.find(elem => elem.name.toLowerCase() === name.toLowerCase())

          personService.update(oldPerson.id, {...oldPerson, number: number}).then(data => {
            console.log('number updated')
            console.log(data)
            setPersons(persons.filter(person => person.id !== oldPerson.id).concat(data))
            setNewName('')
            setNewNumber('')

            // display the success notification 
            setSuccessMessage(`Successfully updated number for ${oldPerson.name}`)
            setTimeout(() => setSuccessMessage(null), 5000)

          }).catch(error => {
            console.log(`Error: could not update number for person ${oldPerson.id}`)
            console.log(error)

            // display error notification
            setErrorMessage(`Could not update number for ${oldPerson.name}`)
            setTimeout(() => setSuccessMessage(null), 5000)

            // re-fetch the phonebook
            personService.getAll().then(data => {
              console.log('re-fetching the phonebook...')
              console.log(data)
              setPersons(data)
            })
          })
        }

      } else {

        personService.create({ name: name, number: number}).then(data => {
          console.log('person created')
          console.log(data)
          setPersons(persons.concat(data))
          setNewName('')
          setNewNumber('')
          
          // display the success notificaion 
          setSuccessMessage(`Successfully created phonebook entry for ${name}`)
          setTimeout(() => setSuccessMessage(null), 5000)
        })
      }
    }
  }

  const deletePerson = (name, id) => {
    console.log('delete clicked', id)
    if (window.confirm(`Do you really want to delete ${name}?`)) {

      personService.remove(id).then(() => {
        console.log(`succesfully deleted person ${id}`)
        setPersons(persons.filter(person => person.id !== id))

      }).catch(error => {
        console.log(`Error: could not delete person ${id}`)
        console.log(error)
        
        // display error notification
        setErrorMessage(`Could not delete ${name}`)
        setTimeout(() => setSuccessMessage(null), 5000)

        // re-fetch the phonebook
        personService.getAll().then(data => {
          console.log('re-fetching the phonebook...')
          console.log(data)
          setPersons(data)
        })
      })
    }
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} type='success'/>
      <Notification message={errorMessage} type='error'/>
      <Filter value={nameFilter} onChangeHandler={event => setNameFilter(event.target.value)} />
      <h2>Add new person</h2>
      <PersonForm
        nameValue={newName}
        numberValue={newNumber}
        nameChangeHandler={event => setNewName(event.target.value)}
        numberChangeHandler={event => setNewNumber(event.target.value)}
        onSubmitHandler={addPerson}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} nameFilter={nameFilter} deletePerson={deletePerson} />
    </div>
  )
}

export default App
