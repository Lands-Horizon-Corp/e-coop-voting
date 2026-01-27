import { Smartphone } from "lucide-react";

const OnlyLandscape = () => {
  return (
    <div className="fixed top-0 left-0 py-16 px-8 w-dvw h-dvh bg-secondary/40 backdrop-blur-md portrait:flex landscape:hidden justify-center items-center flex-col gap-y-4 ">
      <Smartphone className="size-24 -rotate-90" strokeWidth={1} />
      <p className="text-sm text-center">
        Please rotate your device into landscape mode
      </p>
    </div>
  );
};

export default OnlyLandscape;
