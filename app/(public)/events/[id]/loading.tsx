import { Skeleton } from "@/components/ui/skeleton";
import LoadingSpinner from "@/components/loading-spinner";

type Props = {};

const Loading = (props: Props) => {
  return (
    <div className="flex items-center justify-center flex-1 min-h-screen w-full">
      <LoadingSpinner />
      {/* <div className="flex gap-x-2">
                <Skeleton className="h-3 rounded-full w-7" />
                <Skeleton className="h-3 rounded-full w-7" />
            </div> */}
    </div>
  );
};

export default Loading;
