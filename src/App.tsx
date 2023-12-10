import { useState } from 'react'
import { Button } from './components/ui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className="bg-red-400">Hello World</h1>
      <p>Count: {count}</p>
      <Button onClick={() => setCount(count + 1)}>Click me</Button>
    </>
  )
}

export default App
