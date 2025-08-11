import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/persons'
const getPersons = () => {
    return axios
      .get(baseUrl)
}
const postPersons = (newName, newPhoneNumber) => {
    return axios.post(baseUrl, { name: newName, number: newPhoneNumber})
}
const putPerson = (name, newPhoneNumber, id) => {
    return axios.put(baseUrl + '/' + id, { name: name, number: newPhoneNumber})
}
const deleteRecordOnServer = (id) => {
    return axios.delete(baseUrl + '/' + id)
}
export { getPersons, postPersons, putPerson, deleteRecordOnServer }