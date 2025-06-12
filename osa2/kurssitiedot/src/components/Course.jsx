import Header from './Header'
import Total from './Total'
import Content from './Content'

const Course = ({course}) => {
  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}
export default Course
