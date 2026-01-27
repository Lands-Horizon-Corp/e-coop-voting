import { redirect } from 'next/navigation'

type Props = { params : { id : number }};

const IncentivePage = ({ params } : Props) => {
    redirect(`/admin/events/${params.id}/incentive/incentives`)
}

export default IncentivePage