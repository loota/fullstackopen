const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'GOOD':
      const newGoodState = {...state}
      newGoodState.good++
      return newGoodState
    case 'OK':
      const newOkState = {...state}
      newOkState.ok++
      return newOkState
    case 'BAD':
      const newBadState = {...state}
      newBadState.bad++
      return newBadState
    case 'ZERO':
      const newZeroState = {...state}
      newZeroState.good = 0
      newZeroState.ok = 0
      newZeroState.bad = 0
      return newZeroState
    default: return state
  }

}

export default counterReducer