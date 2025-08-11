const PersonForm = ({handleSubmit, newName, handleOnChangeNewName, newPhoneNumber, handleOnChangeNewPhoneNumber}) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input value={newName} onChange={handleOnChangeNewName} />
          number: <input value={newPhoneNumber} onChange={handleOnChangeNewPhoneNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

export default PersonForm