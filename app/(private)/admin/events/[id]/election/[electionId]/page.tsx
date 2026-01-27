import { redirect } from 'next/navigation'

import NotAllowed from '../../_components/not-allowed'

import { isAllowed } from '@/lib/utils'
import { currentUserOrFalse } from '@/lib/auth'

type Props = {
    params : { 
        id : number,
        electionId : number
    }
}

const ElectionPage = async ({ params }: Props) => {
    const currentUser = await currentUserOrFalse();

    if(!isAllowed(["root", "coop_root", "admin"], currentUser)) return <NotAllowed />
  
    redirect(`/admin/events/${params.id}/election/${params.electionId}/dashboard`)
}

export default ElectionPage
