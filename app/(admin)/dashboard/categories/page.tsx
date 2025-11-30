"use client";
import { Loader } from "@/components/reuseable/loader";
import { DataNotFound } from "@/components/data-not-found";
import { AddCategory } from "@/components/dialogs/category/add-category";
import { useCategories } from "@/lib/hooks/queries/use-categories";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SimpleTable } from "@/components/ui/simple-table";
import { Columns } from "./columns";

export default function CategoriesPage() {
  const { data, isLoading, error, isError } = useCategories();
  const columns = Columns();

  // Check if error is 404 (no data)
  const is404Error = error && (error as any)?.response?.status === 404;
  const isOtherError = isError && !is404Error;
  const hasData = data?.success && data?.data && data.data.length > 0;

  return (
    <Card className="w-full h-full min-h-full border-transparent">
      <CardHeader>
        <CardTitle>Categories</CardTitle>
        <CardDescription>Manage Categories</CardDescription>
        <CardAction>
          <AddCategory />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="w-full mx-auto py-10">
          {isLoading && <Loader />}

          {!isLoading && !hasData && !isOtherError && (
            <DataNotFound />
          )}

          {isOtherError && (
            <div className="m-auto w-fit h-auto pb-10 text-destructive">
              Error: {(error as any)?.response?.data?.message || (error as any)?.message || "An error occurred"}
            </div>
          )}

          {!isLoading && hasData && (
            <div>
              <SimpleTable
                columns={columns}
                data={data.data}
                maxHeight="650px"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
