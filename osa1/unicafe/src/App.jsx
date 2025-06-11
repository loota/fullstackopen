import { useState } from 'react'
const Button = (props) => {
  return (
    <button onClick={props.onClick}>{props.text}</button>
  )

}

const Statistics = (props) => {
  const [good, neutral, bad] = [props.good, props.neutral, props.bad];

  const all = (good + neutral + bad)
  const allWeighedSum = 0 + (good * 1 + neutral * 0 + bad *-1)
  const average = allWeighedSum / all || '-'
  const positive = (0 + good / (all)) * 100 || '-'
  if (all > 0) {
    return (
      <div>
	<h2>Statistics</h2>
	<table>
	  <tbody>
	    <StatisticsLine text="Good" value={good} />
	    <StatisticsLine text="Neutral" value={neutral} />
	    <StatisticsLine text="Bad" value={bad} />
	    <StatisticsLine text="All" value={all} />
	    <StatisticsLine text="Average" value={average} />
	    <StatisticsLine text="Positive" value={positive} />
	  </tbody>
	</table>
      </div>
    )
  }
  return (
    <div>
      <h2>Statistics</h2>
      No feedback given
    </div>
  )
}

const StatisticsLine = (props) => {
  return (
    <tr><td>{props.text}</td><td>{props.value}</td></tr>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h2>give feedback</h2>
      <Button onClick={() => setGood(good + 1)} text='good' />
      <Button onClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button onClick={() => setBad(bad + 1)} text='bad' />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
