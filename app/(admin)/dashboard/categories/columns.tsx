import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/types/category";
import { UpdateCategory } from "@/components/dialogs/category/update-category";
import { DeleteCategory } from "@/components/dialogs/category/delete-category";

export const Columns = (): ColumnDef<Category>[] => {
    return [
        {
            accessorKey: "title",
            header: () => <div className="text-start">Title</div>,
            cell: ({ row }) => {
                const title = row.original.title;
                return (
                    <div className="max-w-48">
                        <span className="block truncate" title={title}>
                            {title}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: "description",
            header: () => <div className="text-start">Description</div>,
            cell: ({ row }) => {
                const description = row.original.description;
                return (
                    <div className="max-w-64">
                        <span className="block truncate" title={description || ""}>
                            {description || "-"}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: "isActive",
            header: () => <div className="text-start">Status</div>,
            cell: ({ row }) => {
                const isActive = row.original.isActive ?? true;
                const variant = isActive ? "success" : "secondary";
                return (
                    <Badge variant={variant}>
                        {isActive ? "Active" : "Inactive"}
                    </Badge>
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
                        <UpdateCategory id={rowId} />
                        <DeleteCategory id={rowId} />
                    </div>
                );
            },
        },
    ];
};

