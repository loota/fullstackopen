const Persons = ({personsToShow}) => {
  return (
      <ul>
	{personsToShow.map((person) => {
	  return (
	    <li key={person.name}>
	      {person.name} {person.phone}
	    </li>
	  )
	})}
      </ul>
  )
}
export default Persons
