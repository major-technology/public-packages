"use client";

import { useState } from "react";
import { DownloadIcon, ChevronDownIcon, LoaderIcon } from "lucide-react";

import { Button } from "../../primitives/button";
import { useDataTable } from "../context";
import { InlinePopover } from "./inline-popover";
import type { PropsWithClassName } from "../types";

function triggerDownload(content: string, filename: string, mimeType = "text/csv") {
	const blob = new Blob([content], { type: mimeType });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}

export interface DataTableExportProps<TData = unknown> extends PropsWithClassName {
	/** Serializes row data into a file string (e.g. CSV). The component handles the download. */
	formatRows: (rows: TData[]) => string;
	/** Filename for the current-page export. @default "export.csv" */
	filename?: string;
	/** When provided, adds an "All data" dropdown option. Should call a server endpoint that streams/returns the full export file. */
	onExportAll?: () => void | Promise<void>;
	/** Button label. @default "Export" */
	label?: string;
}

export function DataTableExport<TData>({
	className,
	formatRows,
	filename = "export.csv",
	onExportAll,
	label = "Export",
}: DataTableExportProps<TData>) {
	"use no memo";
	const table = useDataTable<TData>();
	const [isExportingAll, setIsExportingAll] = useState(false);

	const handleExportPage = () => {
		const rows = table.getRowModel().rows.map((r) => r.original);
		triggerDownload(formatRows(rows), filename);
	};

	async function handleExportAll() {
		if (!onExportAll || isExportingAll) {
			return;
		}

		setIsExportingAll(true);

		try {
			await onExportAll();
		} finally {
			setIsExportingAll(false);
		}
	}

	// Simple button when only page export is available
	if (!onExportAll) {
		return (
			<Button variant="outline" className={className} onClick={handleExportPage}>
				<DownloadIcon />
				{label}
			</Button>
		);
	}

	// Dropdown when both modes are available
	return (
		<InlinePopover
			className={className}
			widthClass="w-44"
			trigger={({ toggle }) => (
				<Button variant="outline" onClick={toggle}>
					<DownloadIcon />
					{label}
					<ChevronDownIcon className="size-3.5 opacity-50" />
				</Button>
			)}
		>
			<Button
				variant="ghost"
				onClick={handleExportPage}
				className="flex w-full justify-start rounded-sm px-2 py-1.5 text-sm"
			>
				Current page
			</Button>
			<Button
				variant="ghost"
				onClick={() => void handleExportAll()}
				disabled={isExportingAll}
				className="flex w-full justify-start rounded-sm px-2 py-1.5 text-sm"
			>
				{isExportingAll && <LoaderIcon className="animate-spin" />}
				{isExportingAll ? "Exporting..." : "All data"}
			</Button>
		</InlinePopover>
	);
}
