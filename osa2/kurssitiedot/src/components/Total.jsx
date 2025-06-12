const Total = (props) => {
  return (
    <p><b>total of {props.parts.reduce((accumulator, current) => accumulator + current.exercises, 0)} exercises</b></p>
  )
}

export default Total
