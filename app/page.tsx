"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DragAndDrop } from "@/components/drag-and-drop";
import { ExcelTable } from "@/components/excel-table";
import { useUploadExcel } from "@/hooks/use-upload-excel";

export default function HomePage() {
  const { mutate, isPending, reset, data } = useUploadExcel();

  return (
    <main className="min-h-screen bg-background flex flex-col p-4 sm:p-8 gap-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl">
            Subir archivo Excel
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Arrastra tu archivo o haz clic para seleccionarlo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DragAndDrop mutate={mutate} isPending={isPending} reset={reset} />
        </CardContent>
      </Card>

      {data && <ExcelTable columns={data.columns} rows={data.rows} />}
    </main>
  );
}
