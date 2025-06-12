import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [personNameFilter, setPersonNameFilter] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setPersons(persons.concat({ name: newName, phone: newPhoneNumber }))
  }
  const handleOnChangeNewName = (event) => {
    setNewName(event.target.value)
  }
  const handleOnChangeNewPhoneNumber = (event) => {
    setNewPhoneNumber(event.target.value)
  }
  const onChangePersonNameFilter = (event) => 
  {
    setPersonNameFilter(event.target.value)
  };
  const personsToShow = personNameFilter !== ''
	? (persons.filter((person) => {
	    const regex = new RegExp(event.target.value, 'i')
	    return person.name.match(regex)
	  }))
	: persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter onChangePersonNameFilter={onChangePersonNameFilter} />
      <h3>Add a new</h3>
      <PersonForm handleSubmit={handleSubmit} newName={newName} handleOnChangeNewName={handleOnChangeNewName} newPhoneNumber={newPhoneNumber} handleOnChangeNewPhoneNumber={handleOnChangeNewPhoneNumber} />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} />
    </div>
  )

}

export default App
