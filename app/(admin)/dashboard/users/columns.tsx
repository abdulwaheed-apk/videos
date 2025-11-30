import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/user";
import { DeleteUser } from "@/components/dialogs/user/delete-user";
import Image from "next/image";

export const Columns = (): ColumnDef<User>[] => {
  return [
    {
      accessorKey: "photoURL",
      header: () => <div className="text-start">Avatar</div>,
      cell: ({ row }) => {
        const photoURL = row.original.photoURL;
        return (
          <div className="w-10 h-10 rounded-full overflow-hidden">
            {photoURL ? (
              <Image
                src={photoURL}
                alt={row.original.displayName || row.original.email}
                width={40}
                height={40}
                className="rounded-full object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-xs font-medium">
                {row.original.email?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: () => <div className="text-start">Email</div>,
      cell: ({ row }) => {
        const email = row.original.email;
        return (
          <div className="max-w-64">
            <span className="block truncate" title={email}>
              {email}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "displayName",
      header: () => <div className="text-start">Name</div>,
      cell: ({ row }) => {
        const displayName = row.original.displayName;
        return (
          <div className="max-w-48">
            <span className="block truncate" title={displayName || ""}>
              {displayName || "-"}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const rowId = row.original.id;
        if (!rowId) return null;
        return (
          <div className="flex justify-center items-center gap-2">
            <DeleteUser id={rowId} />
          </div>
        );
      },
    },
  ];
};

