import { Spinner } from "@material-tailwind/react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-full">
      <Spinner className="h-8 w-8 text-gray-900" />
    </div>
  );
}