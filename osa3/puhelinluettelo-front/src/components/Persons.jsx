const Persons = ({personsToShow, deleteRecord}) => {
  return (
      <ul>
	{personsToShow.map((person) => {
	  return (
	    <li key={person.id}>
		  {person.id} - 
	      {person.name} {person.number}
		  <button key={person.id} onClick={() => deleteRecord(person.name, person.id)}>delete</button>
	    </li>
	  )
	})}
      </ul>
  )
}
export default Persons