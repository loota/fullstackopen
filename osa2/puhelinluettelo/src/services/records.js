import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'
const getPersons = () => {
    return axios
      .get(baseUrl)
}
const postPersons = (newName, newPhoneNumber) => {
    return axios.post(baseUrl, { name: newName, phoneNumber: newPhoneNumber})
}
const putPerson = (name, newPhoneNumber, id) => {
    return axios.put(baseUrl + '/' + id, { name: name, phoneNumber: newPhoneNumber})
}
const deleteRecordOnServer = (id) => {
    return axios.delete(baseUrl + '/' + id)
}
export { getPersons, postPersons, putPerson, deleteRecordOnServer }