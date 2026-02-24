import type { Row } from "@tanstack/react-table";

/**
 * Utility to get selected row models as original data
 */
export function getSelectedRows<TData>(rows: Row<TData>[]): TData[] {
	return rows.map((row) => row.original);
}

/**
 * Fetches a URL and triggers a browser download of the response.
 *
 * Use this in `onExportAll` to call a server endpoint that returns a file:
 * ```ts
 * onExportAll={async () => {
 *   await downloadFile("/api/users/export?format=csv");
 * }}
 * ```
 *
 * The filename is resolved in this order:
 * 1. Explicit `filename` argument
 * 2. `Content-Disposition` header from the response
 * 3. Falls back to `"export"`
 */
export async function downloadFile(url: string, filename?: string): Promise<void> {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Download failed: ${response.status} ${response.statusText}`);
	}

	if (!filename) {
		const disposition = response.headers.get("Content-Disposition");
		const match = disposition?.match(/filename=(?:"([^"]*)"|([^;,\s]*))/);
		filename = match?.[1] ?? match?.[2] ?? "export";
	}

	const blob = await response.blob();
	const blobUrl = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = blobUrl;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(blobUrl);
}
