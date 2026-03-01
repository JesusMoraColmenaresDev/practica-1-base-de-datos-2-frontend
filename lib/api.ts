import axios from "axios";

export interface ExcelRow {
  [key: string]: string | number | null;
}

export interface UploadExcelResponse {
  columns: string[];
  rows: ExcelRow[];
}

export async function uploadExcel(
  file: File,
): Promise<UploadExcelResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axios.post("http://localhost:8000/upload", formData);

  return data;
}
