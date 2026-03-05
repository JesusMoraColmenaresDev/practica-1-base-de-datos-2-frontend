import axios from "axios";

export interface ExcelRow {
	[key: string]: string | number | null;
}

export interface UploadExcelResponse {
	columns: string[];
	rows: ExcelRow[];
	count: number;
	inserted: number;
	errors: Array<{ index: number; reason: string }>;
	processed?: boolean;
	timeDate?: string;
	reportTimeDate?: string;
	reportHeader?: string;
}

export async function uploadExcel(
	file: File,
	timeDate?: string,
): Promise<UploadExcelResponse> {
	const formData = new FormData();
	formData.append("file", file);
	console.log("Uploading file:", file.name, file.size);

	// convert FormData to a JSON-safe object for logging
	const formJson: Record<string, unknown> = {};
	for (const [key, value] of formData.entries()) {
		if (value instanceof File) {
			const meta = { name: value.name, size: value.size, type: value.type };
			if (key in formJson) {
				if (Array.isArray(formJson[key])) formJson[key].push(meta);
				else formJson[key] = [formJson[key], meta];
			} else {
				formJson[key] = meta;
			}
		} else {
			const v = value as string;
			if (key in formJson) {
				if (Array.isArray(formJson[key])) formJson[key].push(v);
				else formJson[key] = [formJson[key], v];
			} else {
				formJson[key] = v;
			}
		}
	}

	console.log("FormData as JSON:", JSON.stringify(formJson, null, 2));

	// Additionally, create a base64 JSON payload of the file and send that to /upload-json
	// This lets the backend accept JSON instead of multipart/form-data.
	const arrayBuffer = await file.arrayBuffer();
	const uint8 = new Uint8Array(arrayBuffer);
	// convert to binary string in chunks to avoid call stack issues
	let binary = "";
	const chunkSize = 0x8000;
	for (let i = 0; i < uint8.length; i += chunkSize) {
		const chunk = uint8.subarray(i, i + chunkSize);
		binary += String.fromCharCode.apply(null, Array.from(chunk));
	}
	const base64 = btoa(binary);

	const jsonPayload = {
		filename: file.name,
		type: file.type,
		size: file.size,
		data: base64,
		timeDate,
		normalization: {
			address: "lowercase",
			city: "uppercase_trim_before_slash",
			state: "lowercase",
			country_region: "uppercase",
		},
	};

	console.log("Applying location normalization rules before backend import:", {
		address: "lowercase",
		city: "uppercase_trim_before_slash",
		state: "lowercase",
		country_region: "uppercase",
	});

	// Log a preview of the JSON payload (don't log full base64 to avoid huge console output)
	console.log("Upload JSON preview:", {
		filename: jsonPayload.filename,
		type: jsonPayload.type,
		size: jsonPayload.size,
		dataPreview: jsonPayload.data.slice(0, 200),
	});

	const { data } = await axios.post(
		"http://localhost:4000/upload-json",
		jsonPayload,
	);

	return data;
}
