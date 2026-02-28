"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, FileSpreadsheet, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatSize } from "@/lib/utils";
import { useUploadExcel } from "@/hooks/use-upload-excel";
import { toast } from "sonner";

interface DroppedFile {
  file: File;
  id: string;
}

export function DragAndDrop() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<DroppedFile | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending, reset } = useUploadExcel();

  const setDroppedFile = useCallback(
    (newFile: File) => {
      reset();
      setFile({ file: newFile, id: crypto.randomUUID() });
    },
    [reset],
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) setDroppedFile(dropped);
    },
    [setDroppedFile],
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) setDroppedFile(selected);
    },
    [setDroppedFile],
  );

  const clearInput = useCallback(() => {
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const removeFile = useCallback(() => {
    reset();
    setFile(null);
    clearInput();
  }, [reset, clearInput]);

  const handleUpload = () => {
    if (!file) return;
    mutate(file.file, {
      onSuccess: () => {
        setFile(null);
        clearInput();
        toast.success("Archivo subido correctamente.");
      },
      onError: () => {
        toast.error("Error al subir el archivo.");
      },
    });
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "cursor-pointer rounded-xl border-2 border-dashed",
          "transition-all duration-200 p-8 sm:p-14",
          "flex flex-col items-center justify-center gap-4 text-center",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border hover:border-muted-foreground/50 hover:bg-muted/40",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={onInputChange}
        />

        <div
          className={cn(
            "p-4 rounded-full transition-colors",
            isDragging
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground",
          )}
        >
          {isDragging ? (
            <FileSpreadsheet className="w-8 h-8" />
          ) : (
            <Upload className="w-8 h-8" />
          )}
        </div>

        <div>
          <p className="font-medium text-sm sm:text-base">
            {isDragging
              ? "Suelta el archivo aquí"
              : "Arrastra tu archivo de Excel"}
          </p>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            XLSX, XLS, CSV
          </p>
        </div>

        <Badge variant="outline" className="text-xs text-muted-foreground">
          o haz clic para explorar
        </Badge>
      </div>

      {file && (
        <div className="space-y-3">
          <ul className="space-y-2">
            <li className="flex items-center gap-3 bg-muted/50 border border-border rounded-lg px-4 py-3">
              <FileSpreadsheet className="w-5 h-5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatSize(file.file.size)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                disabled={isPending}
                className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </li>
          </ul>

          <Button
            className="w-full"
            disabled={isPending}
            onClick={handleUpload}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Subir archivo
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
