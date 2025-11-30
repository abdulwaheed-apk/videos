import { IconLoader3 } from "@tabler/icons-react";

export function Loader() {
  return (
    <div className="w-full h-full min-h-80 min-w-40 my-auto mx-auto flex justify-center items-center">
      <IconLoader3 className="animate-spin" />
    </div>
  );
}
