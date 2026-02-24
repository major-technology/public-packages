"use client";

import { useState } from "react";
import { Input } from "@/registry/default/ui/input";
import { useDataTable } from "../../../../context";
import { SEARCH_DEBOUNCE_MS, TEXT_FILTER_OPERATORS, FILTER_INPUT_CLASS } from "../../../../constants";
import { useDebouncedCallback } from "../../../../hooks/use-debounced-callback";
import { FilterCardHeader, OperatorSelect, TEXT_OPERATORS } from "../shared";
import type { TextFilterOperator, TextFilterValue } from "../../../../types";

const DEFAULT_TEXT_OPERATOR: TextFilterOperator = TEXT_FILTER_OPERATORS.CONTAINS;

export interface TextFilterCardProps {
	columnId: string;
	title: string;
	onRemove: () => void;
}

export function TextFilterCard({ columnId, title, onRemove }: TextFilterCardProps) {
	"use no memo";
	const table = useDataTable();
	const column = table.getColumn(columnId);
	const currentValue = column?.getFilterValue() as TextFilterValue | undefined;
	const [operator, setOperator] = useState<TextFilterOperator>(currentValue?.op ?? DEFAULT_TEXT_OPERATOR);
	const [localValue, setLocalValue] = useState<string>(currentValue?.value ?? "");

	const [applyFilter] = useDebouncedCallback((value: TextFilterValue | undefined) => {
		column?.setFilterValue(value);
	}, SEARCH_DEBOUNCE_MS);

	if (!column) {
		return null;
	}

	const handleOperatorChange = (newOp: TextFilterOperator) => {
		setOperator(newOp);
		applyFilter(localValue ? { op: newOp, value: localValue } : undefined);
	};

	const placeholder = TEXT_OPERATORS.find((o) => o.value === operator)?.label ?? "Value";

	return (
		<>
			<FilterCardHeader title={title} onRemove={onRemove}>
				<OperatorSelect value={operator} onChange={handleOperatorChange} options={TEXT_OPERATORS} />
			</FilterCardHeader>

			<Input
				placeholder={`${placeholder}...`}
				value={localValue}
				onChange={(e) => {
					setLocalValue(e.target.value);
					applyFilter(e.target.value ? { op: operator, value: e.target.value } : undefined);
				}}
				className={FILTER_INPUT_CLASS}
			/>
		</>
	);
}
