import React from 'react'

import { Button } from '@/components/ui/button'
import UserAvatar from '@/components/user-avatar'

import { TMemberAttendeesMinimalInfo } from '@/types'

type Props = { results : TMemberAttendeesMinimalInfo[], onPick : (member : TMemberAttendeesMinimalInfo) => void }

const MultiResultSelect = ({ results, onPick }: Props) => {

  return (
    <div className="flex flex-col items-center gap-y-6 w-[350px] lg:w-[36rem] lg:max-w-xl">
        <div className="flex flex-col gap-y-2 items-center">
            <p className="text-xl">Search Result</p>
            <p className="text-foreground/60 text-sm lg:text-base text-center">We found multiple results</p>
        </div>
        <div className="w-full">
            <p className="text-foreground/70 text-sm">Search matched : <span className="text-foreground font-medium">{results.length}</span></p>
        </div>
        <div className="flex flex-col gap-y-4 max-h-[60vh] overflow-y-scroll thin-scroll py-8 w-full">
            {
                results.map((member)=>(
                    <div 
                        key={member.id}
                        onClick={()=>onPick(member)}
                        className="cursor-pointer group flex px-3 py-2 items-center w-full gap-x-2 duration-100 ease-in rounded-xl bg-secondary/70 hover:bg-secondary">
                        <div className="flex-1 flex items-center gap-x-2">
                            <UserAvatar 
                                src={member.picture as ""} 
                                fallback={`${member.firstName.charAt(0)} ${member.lastName.charAt(0)}`} 
                                className="size-12"
                            />
                            <div className="flex flex-col">
                                <p>{`${member.firstName} ${member.lastName}`}</p>
                                <p className="text-sm inline-flex"><span className="text-foreground/60">Passbook :&nbsp;</span><span>{member.passbookNumber}</span></p>
                            </div>
                        </div>
                        <Button size="sm" className="opacity-10 ease-in bg-transparent text-foreground hover:bg-transparent group-hover:opacity-100" >Select</Button>
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default MultiResultSelect