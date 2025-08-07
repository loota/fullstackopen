import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import { getPersons, postPersons, putPerson, deleteRecordOnServer } from './services/records.js'
import Notification from './components/Notification.jsx'

const App = () => {
  const [persons, setPersons] = useState([]) 

  useEffect(() => {
    getPersons()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const [newName, setNewName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [personNameFilter, setPersonNameFilter] = useState('')
  const [UiMessage, setUiMessage] = useState(null)

  const handleSubmit = (event) => {
    event.preventDefault()
    const existingPerson = persons.find((person) => {
      return person.name === newName
    })
    if (existingPerson) {
      if (window.confirm(newName + " is already added to the phonebook, replace old number with the new one?")) {
        putPerson(newName, newPhoneNumber, existingPerson.id)
        .then(() => {
          setUiMessage('Added ' + newName)
          setTimeout(() => {
            setUiMessage(null)
          }, 5000)
          getPersons()
            .then(response => {
              setPersons(response.data)
            })
        })
        .catch(error => {
          setUiMessage(
            `Information of '${newName}' has already been removed from server`
          )
          setPersons(persons.filter(n => n.name !== newName))
        })    
      }
      return
    }
    postPersons(newName, newPhoneNumber)
    .then(() => {
      setUiMessage('Added ' + newName)
      setTimeout(() => {
        setUiMessage(null)
      }, 5000)
      getPersons()
        .then(response => {
           setPersons(response.data)
        })
      })
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

  const deleteRecord = (name, id) => {
    if (window.confirm("Poistetaanko henkilö " + name)) {
      deleteRecordOnServer(id)
      .then(() => {
        setUiMessage('Deleted ' + newName)
          setTimeout(() => {
            setUiMessage(null)
          }, 5000)
        getPersons()
          .then(response => {
            setPersons(response.data)
          })
        }
      )
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={UiMessage} />
      <Filter onChangePersonNameFilter={onChangePersonNameFilter} />
      <h3>Add a new</h3>
      <PersonForm handleSubmit={handleSubmit} newName={newName} handleOnChangeNewName={handleOnChangeNewName} newPhoneNumber={newPhoneNumber} handleOnChangeNewPhoneNumber={handleOnChangeNewPhoneNumber} />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deleteRecord={deleteRecord} />
    </div>
  )

}

export default App
