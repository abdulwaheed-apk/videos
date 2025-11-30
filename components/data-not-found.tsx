import { IconAlertTriangle } from "@tabler/icons-react";

export function DataNotFound() {
  return (
    <div className="w-full h-full min-h-80 my-auto mx-auto flex flex-col justify-center items-center p-6 text-center rounded-lg bg-white">
      <IconAlertTriangle
        className="text-gray-400 size-16 mb-4 md:size-20"
        aria-hidden="true"
      />
      <h2 className="text-xl font-semibold text-gray-700 mb-2 md:text-2xl">
        No Data Available
      </h2>
      <p className="text-base font-light text-gray-500 max-w-sm md:text-lg">
        We couldn't find the information you were looking for. Please check your
        filters or try again later.
      </p>
    </div>
  );
}
