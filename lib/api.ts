import axios from "axios";

export async function uploadExcel(
  file: File,
): Promise<Record<string, string | number | null>> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axios.post("http://localhost:4000/upload", formData);

  return data;
}
