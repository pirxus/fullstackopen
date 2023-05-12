import { useState } from 'react'

const Heading = ({ text }) => {
  return <h1>{text}</h1>
}

const Button = ({ text, handleClick }) => {
  return <button onClick={handleClick}>{text}</button>
}

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const total = props.good + props.neutral + props.bad
  const average = (total === 0) ? 0 : (props.good - props.bad) / total
  const positive =  (total === 0) ? 0 : (props.good / total) * 100

  const statistics = (
    <table>
      <tbody>
        <StatisticLine text='good' value={props.good}/>
        <StatisticLine text='neutral' value={props.neutral}/>
        <StatisticLine text='bad' value={props.bad}/>
        <StatisticLine text='all' value={total}/>
        <StatisticLine text='average' value={average}/>
        <StatisticLine text='positive' value={positive + ' %'}/>
      </tbody>
    </table>
  )

  return (total !== 0) ? statistics : <p>No feedback given</p>
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Heading text='give feedback'/>
      <div>
        <Button text='good' handleClick={() => setGood(good + 1)}/>
        <Button text='neutral' handleClick={() => setNeutral(neutral + 1)}/>
        <Button text='bad' handleClick={() => setBad(bad + 1)}/>
      </div>
      <Heading text='statistics'/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App
