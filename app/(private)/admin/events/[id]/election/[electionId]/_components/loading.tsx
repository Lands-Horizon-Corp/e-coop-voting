import { Loader2 } from 'lucide-react'
import React from 'react'

const Loading = () => {
  return (
     <div className="w-full h-screen  flex justify-center items-center space-x-2 text-primary">
     <Loader2 className=" size-5 animate-spin"></Loader2>
     <h1 className=" animate-pulse">Loading...</h1>
  </div>
  )
}

export default Loading