import React from 'react'

import ReportHome from './_components/report-home';

import { eventIdSchema } from '@/validation-schema/commons';
import { currentUserOrFalse } from '@/lib/auth';
import { isAllowed } from '@/lib/utils';
import NotAllowed from '../../_components/not-allowed';

type Props = { params : { id : number } }

const IncentiveReportPage = async ({ params }: Props) => {
    const currentUser = await currentUserOrFalse();

    const eventId = eventIdSchema.parse(params.id);
 
    if(!isAllowed(["root", "coop_root", "admin", "staff"], currentUser) || !currentUser) return <NotAllowed />

    return (
        <div className="flex px-4 min-h-screen flex-col w-full">
            <ReportHome currentUser={ currentUser } eventId={eventId} />
        </div>
    );
}

export default IncentiveReportPage
