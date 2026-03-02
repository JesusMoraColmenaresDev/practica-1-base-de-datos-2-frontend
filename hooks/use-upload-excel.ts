import { useMutation } from "@tanstack/react-query";
import { uploadExcel } from "@/lib/api";
import { toast } from "sonner";

export function useUploadExcel() {
	return useMutation({
		mutationFn: (file: File) => uploadExcel(file),
		onSuccess: (data) => {
			toast.success(`Uploaded ${data.count ?? data.rows?.length ?? 0} rows`);
		},
		onError: (err: any) => {
			const msg = err?.response?.data?.error ?? err?.message ?? "Upload failed";
			toast.error(String(msg));
		},
	});
}
