import React, { useState, useEffect } from 'react'

import personService from './services/persons'

import './App.css'

//muuten kai toimii, mutta tiedot eivät päivity, esim alussa tai deletoinnin jälkeen
//tutkitaan tätä, myös pavelimen konsolia
//lisäys ei päivitä tietoja heti!!!
//Github test

//Tehtävät 2.6, 2.7 ja 2.8, 2.10 Nyt toimii!!!
//2.15, 2.16, 2.17 ja 2.18 Toimii!!!
//2.19 ja 2.20 Toimii!!!
//Tässä on todella paljon tärkeää oppia, taulukoiden käsittelyä, State-objekti taulukon käsittelyä!!!
//Tehdään maiden tiedot myöhemmin
const Filter = ({handleFilterChange}) => {
  return (
    <div>
      <label>filter shown with </label>
      <input type="text" onChange={handleFilterChange}/>
    </div>
  )  
}

//pitäisikö id-numero lisätä?
const PersonForm = ({addPerson, handleNameChange, handleNumberChange, newName, newNumber}) => {
  return (
    <div>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

//Render single person
const Person = ({person, deletePerson}) => {
  return (
    <p>{person.name} {person.number} <button onClick={() => deletePerson(person.id, person.name)}>delete</button></p>
  )
}

//Component filtered persons, which show is true and renders these persons
const Persons = ({persons, deletePerson}) => {
  const filtered = persons.filter(person => person.show === true)
  //console.log("filtered", filtered)  
  return (
    <div>
      {filtered.map(person =>
      <Person key={person.name} person={person} deletePerson={deletePerson} />
      )}  
    </div>
  )
}

//Component for information of person adding
const Notification = ({message, messageType}) => {
  const addingStyle = {
    color: "green",
    fontSize: 30,
    background: "lightgrey",
    borderWidht: 1,
    borderRadius: 5,
    borderColor: "green",
    borderStyle: "solid",
    width: 500,
    marginBottom: 20,
    marginTop: 10
  }
  const errorStyle = {
    color: "red",
    fontSize: 30,
    background: "lightgrey",
    borderWidht: 1,
    borderRadius: 5,
    borderColor: "red",
    borderStyle: "solid",
    width: 500,
    marginBottom: 20,
    marginTop: 10
  }

  if (message === null) {
    return null
  }
  if (messageType === 'error') {
    return (
      <div style={errorStyle}>{message}</div>
    )  
  }

  return (
    <div style={addingStyle}>{message}</div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    /*{name: 'Arto Hellas', number: '040-3459067', show: true}, 
    {name: 'Jouni Tirkkonen', number: '050-3297068', show: true}, 
    {name: 'Sanna Siipola', number: '040-4568900', show: true}*/
  ]) 
  const [newName, setNewName ] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [informationMessage, setInformationMessage] = useState(null)
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    console.log('effect')    
    personService
    .getAll()      
    .then(response => {        
      console.log('promise fulfilled')
      console.log("response", response.data)        
      setPersons(response.data)
    })  
  }, [])  
  console.log("persons", persons)     
 
  const addPerson = (event) => {
    console.log('newName', newName)
    event.preventDefault()
    const names = persons.map(element => element.name)
    const findName = names.includes(newName);
    
    if (!findName) {
      const personObject = {name: newName, number: newNumber, show: true}
      console.log("personObject", personObject);
      personService
      .create(personObject)
      .then(response => {
        console.log(response)
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
        console.log("name added", persons)
      })
      setInformationMessage(`Added ${newName}`)
      setTimeout(() => {
        setInformationMessage(null)
      }, 5000)
      //setPersons(persons.concat(personObject))
    } else {
      const message = `${newName} is already added to phonebook, replace the old number with a new one`
      const result = window.confirm(message)
      const person = persons.find(p => p.name === newName)
      const id = person.id
      console.log("person", person)
     
      //const url = `http://localhost:3001/persons/${id}`
      const changedPerson = {...person, number: newNumber}
      if (result) {
        personService
        .update(id, changedPerson)
        .then(response => {
          //console.log("number updated")
          setPersons(persons.map(person => person.id !== id ? person : response.data))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setInformationMessage(`Information of ${newName} has already been removed from server`)
          setMessageType('error')
          setTimeout(() => {
            setInformationMessage(null)
          }, 5000)
          setPersons(persons.filter(person => person.id !== id))
          setNewName('')
          setNewNumber('')
          //alert(`Name ${newName} was already deleted from server`)      
        })
      }
      //window.alert(`${newName} is already added to phonebook`)
    }
  }

  //Function deletes person
  const deletePerson = (deleteId, deleteName) => {
    //console.log("in delete person", deleteId)
    const message = `Delete ${deleteName}`
    const result = window.confirm(message)
    
    if (result) {
      personService
        .deletePerson(deleteId)
        .then(response => {
          //Kutsutaan tiedot uudestaan serveriltä, vois ehkä tehdä jollain päivitykselläkin
          personService
          .getAll()      
          .then(response => {        
            //console.log('promise fulfilled')        
            setPersons(response.data)
          })  
        })
    }
  }

  //Handles name input field
  const handleNameChange = (event) => {
    //tulostaa konsoliin syötteen
    //console.log(event.target.value)
    setNewName(event.target.value)
  }

  //Handles number input field
  const handleNumberChange = (event) => {
    //console.log("handle number Change")
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    const newArray = [...persons]
    
    newArray.forEach(element => element.show = false)
     //For loopilla tehty vastaava
    /*for (let i = 0; i < newArray.length; i++) {
      newArray[i] = {...newArray[i], show: false}
    }*/
    
    newArray.forEach(element => {
      if (element.name.toLowerCase().includes(event.target.value.toString().toLowerCase())) {
        element.show = true
      }
    })
   
    //Tässä for loopilla tehty vastaava
    /*for (let i=0; i < newArray.length; i++) {
      if (newArray[i].name.toLowerCase().includes(event.target.value.toString().toLowerCase())) {
        newArray[i] = {...newArray[i], show: true}
      }
    }*/
    setPersons(newArray)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <Notification message={informationMessage} messageType={messageType} />
      <PersonForm addPerson={addPerson} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} 
      newName={newName} newNumber={newNumber} />
      <h3>Numbers</h3>
      <Persons persons={persons} deletePerson={deletePerson}/>
    </div>
  )
}

export default App