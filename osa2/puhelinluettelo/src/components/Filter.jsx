const Filter = ({onChangePersonNameFilter}) => {
  return (
    <div>
      <p>filter shown with</p>
      <input type="text" onChange={onChangePersonNameFilter} />
    </div>
  )
}

export default Filter
