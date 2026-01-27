import { currentUserOrThrowAuthError } from "@/lib/auth";
import EventTable from "./_components/event-table";

type TParams = {
   params:{id:number}
};

const EventsPage = async ({params}: TParams) => {
   const user = await currentUserOrThrowAuthError();

   return (
      <div className="flex lg:p-5 min-h-screen flex-col w-full ">
         <EventTable user={user} params={params} />
      </div>
   );
};

export default EventsPage;
