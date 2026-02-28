import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DragAndDrop } from "@/components/drag-and-drop";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl">
            Subir archivo Excel
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Arrastra tu archivo o haz clic para seleccionarlo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DragAndDrop />
        </CardContent>
      </Card>
    </main>
  );
}
