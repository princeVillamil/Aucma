import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import { Button, Card, Typography } from "@material-tailwind/react";

function App() {
  const [count, setCount] = useState(0)

  return (
    
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="p-6 shadow-lg">
        <Typography variant="h4" color="blue-gray">
          Material Tailwind + Vite
        </Typography>
        <Button className="mt-4">Click Me</Button>
      </Card>
    </div>
    
  )
}

export default App
