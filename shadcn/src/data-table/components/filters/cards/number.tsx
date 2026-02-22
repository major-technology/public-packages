"use client";

import { useState } from "react";
import { Input } from "../../../../primitives/input";
import { useDataTable } from "../../../context";
import { SEARCH_DEBOUNCE_MS, NUMBER_FILTER_OPERATORS, FILTER_INPUT_CLASS } from "../../../constants";
import { useDebouncedCallback } from "../../../hooks/use-debounced-callback";
import { FilterCardHeader, OperatorSelect, NUMBER_OPERATORS } from "../shared";
import type { NumberFilterOperator, NumberFilterValue } from "../../../types";

const DEFAULT_NUMBER_OPERATOR: NumberFilterOperator = NUMBER_FILTER_OPERATORS.EQUALS;

type NumberSingleOperator = Exclude<NumberFilterOperator, typeof NUMBER_FILTER_OPERATORS.RANGE>;

function getInitialState(currentValue: NumberFilterValue | undefined) {
	if (!currentValue) {
		return { value: "", min: "", max: "" };
	}

	if (currentValue.op === NUMBER_FILTER_OPERATORS.RANGE) {
		return {
			value: "",
			min: currentValue.min !== undefined ? String(currentValue.min) : "",
			max: currentValue.max !== undefined ? String(currentValue.max) : "",
		};
	}

	return {
		value: String(currentValue.value),
		min: "",
		max: "",
	};
}

export interface NumberFilterCardProps {
	columnId: string;
	title: string;
	onRemove: () => void;
}

export function NumberFilterCard({ columnId, title, onRemove }: NumberFilterCardProps) {
	"use no memo";
	const table = useDataTable();
	const column = table.getColumn(columnId);
	const currentValue = column?.getFilterValue() as NumberFilterValue | undefined;
	const initial = getInitialState(currentValue);
	const [operator, setOperator] = useState<NumberFilterOperator>(currentValue?.op ?? DEFAULT_NUMBER_OPERATOR);
	const [localValue, setLocalValue] = useState<string>(initial.value);
	const [localMin, setLocalMin] = useState<string>(initial.min);
	const [localMax, setLocalMax] = useState<string>(initial.max);

	const isRange = operator === NUMBER_FILTER_OPERATORS.RANGE;

	const [applyFilter, cancelFilter] = useDebouncedCallback((value: NumberFilterValue | undefined) => {
		column?.setFilterValue(value);
	}, SEARCH_DEBOUNCE_MS);

	if (!column) {
		return null;
	}

	const applySingle = (op: NumberSingleOperator, raw: string) => {
		if (raw === "" || Number.isNaN(Number(raw))) {
			applyFilter(undefined);
			return;
		}

		applyFilter({ op, value: Number(raw) });
	};

	const applyRange = (min: string, max: string) => {
		const minNum = min !== "" && !Number.isNaN(Number(min)) ? Number(min) : undefined;
		const maxNum = max !== "" && !Number.isNaN(Number(max)) ? Number(max) : undefined;
		applyFilter(
			minNum === undefined && maxNum === undefined
				? undefined
				: { op: NUMBER_FILTER_OPERATORS.RANGE, min: minNum, max: maxNum },
		);
	};

	const handleOperatorChange = (newOp: NumberFilterOperator) => {
		cancelFilter();
		setOperator(newOp);
		setLocalValue("");
		setLocalMin("");
		setLocalMax("");
		column.setFilterValue(undefined);
	};

	const placeholder = NUMBER_OPERATORS.find((o) => o.value === operator)?.label ?? "Value";

	return (
		<>
			<FilterCardHeader title={title} onRemove={onRemove}>
				<OperatorSelect value={operator} onChange={handleOperatorChange} options={NUMBER_OPERATORS} />
			</FilterCardHeader>

			{isRange ? (
				<div className="flex items-center gap-1.5">
					<Input
						type="number"
						placeholder="Min"
						value={localMin}
						onChange={(e) => {
							setLocalMin(e.target.value);
							applyRange(e.target.value, localMax);
						}}
						className={FILTER_INPUT_CLASS}
					/>
					<span className="shrink-0 text-xs text-muted-foreground">to</span>
					<Input
						type="number"
						placeholder="Max"
						value={localMax}
						onChange={(e) => {
							setLocalMax(e.target.value);
							applyRange(localMin, e.target.value);
						}}
						className={FILTER_INPUT_CLASS}
					/>
				</div>
			) : (
				<Input
					type="number"
					placeholder={`${placeholder}...`}
					value={localValue}
					onChange={(e) => {
						setLocalValue(e.target.value);
						applySingle(operator as NumberSingleOperator, e.target.value);
					}}
					className={FILTER_INPUT_CLASS}
				/>
			)}
		</>
	);
}
