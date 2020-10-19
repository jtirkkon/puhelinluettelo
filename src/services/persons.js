import axios from 'axios'
const baseUrl =  'https://evening-savannah-71492.herokuapp.com/api/persons'

//Ennen herokua local: const baseUrl = 'http://localhost:3001/api/persons'
//Heroku: https://evening-savannah-71492.herokuapp.com/
//alkuperäinen baseUrhl 'http://localhost:3001/persons'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newObject => {
  console.log("in create")
  return axios.post(baseUrl, newObject)
  
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}

const deletePerson = (id) => {
  //console.log("in deletePerson persons.js", id)
  return axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, create, update, deletePerson }