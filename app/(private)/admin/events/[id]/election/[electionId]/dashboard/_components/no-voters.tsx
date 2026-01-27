import React from 'react'

const NoVoters = () => {
  return (
    <div className="w-full h-[50vh] flex justify-center items-center">
          <div className="flex flex-col items-center space-y-2">
             <p className="font-bold text-[5rem]">🍃</p>
             <p className="font-semibold">{`There's still no vote captured!`}</p>
          </div>
    </div>
  )
}

export default NoVoters