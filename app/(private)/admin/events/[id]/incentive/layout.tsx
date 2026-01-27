import React, { ReactNode } from 'react'
import IncentiveNavigation from './_components/incentive-navigation'

type Props = { 
    children? : ReactNode,
    params : { id : number }
}

const IncentiveLayout
 = ({ children, params }: Props) => {
  return (
    <div className="flex flex-col w-full">
        <IncentiveNavigation eventId={params.id} />
        { children }
    </div>
  )
}

export default IncentiveLayout
