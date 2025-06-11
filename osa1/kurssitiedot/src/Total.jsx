const Total = (props) => {
  return (
    <p>Number of exercises {props.parts.reduce((accumulator, current) => accumulator + current.exercises, 0)}</p>
  )
}

export default Total
