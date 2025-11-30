"use client";
import { Loader } from "@/components/reuseable/loader";
import { DataNotFound } from "@/components/data-not-found";
import { useUsers } from "@/lib/hooks/queries/use-users";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SimpleTable } from "@/components/ui/simple-table";
import { Columns } from "./columns";

export default function UsersPage() {
  const { data, isLoading, error, isError } = useUsers();
  const columns = Columns();

  // Check if error is 404 (no data)
  const is404Error = error && (error as any)?.response?.status === 404;
  const isOtherError = isError && !is404Error;
  const hasData = data?.success && data?.data && data.data.length > 0;

  return (
    <Card className="w-full h-full min-h-full border-transparent">
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>Manage Users</CardDescription>
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

