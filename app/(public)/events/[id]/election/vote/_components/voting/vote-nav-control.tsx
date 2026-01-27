import LoadingSpinner from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  onBack: () => void;
  onNext: () => void;
  onFinalize: () => void;
  casted: boolean;
  isLoading: boolean;

  currentPage: number;
  lastPage: number;
  canNext: boolean;
  canFinalize: boolean;
};

const VoteNavControl = ({
  currentPage,
  lastPage,
  casted,
  isLoading,
  onBack,
  onNext,
  canNext,
  canFinalize,
  onFinalize,
}: Props) => {
  return (
    <div className="w-full flex items-center p-4 justify-between">
      <Button
        disabled={currentPage == 0 || isLoading || casted}
        onClick={onBack}
      >
        <ChevronLeft />
      </Button>
      {currentPage > lastPage ? (
        <Button
          onClick={onFinalize}
          disabled={isLoading || casted || !canFinalize}
        >
          {isLoading || casted ? <LoadingSpinner /> : "Cast Vote"}
        </Button>
      ) : (
        <Button disabled={!canNext || casted} onClick={onNext}>
          <ChevronRight />
        </Button>
      )}
    </div>
  );
};

export default VoteNavControl;
