import { SearchX } from 'lucide-react'
import React from 'react'

const NotFound = () => {
  return (
    <div className='w-full h-screen flex justify-center items-center'>
         <div className='flex flex-col items-center gap-2'>
         <SearchX className=' text-muted-foreground w-12 h-auto' />
         Page not Found!
         </div>
    </div>
  )
}

export default NotFound