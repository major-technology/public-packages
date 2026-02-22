"use client";

import { useState } from "react";
import { Input } from "../../../../primitives/input";
import { useDataTable } from "../../../context";
import { DATE_FILTER_OPERATORS, DATE_FILTER_INPUT_CLASS } from "../../../constants";
import { FilterCardHeader, OperatorSelect, DATE_OPERATORS } from "../shared";
import type { DateFilterOperator, DateFilterValue } from "../../../types";

const DEFAULT_DATE_OPERATOR: DateFilterOperator = DATE_FILTER_OPERATORS.EQUALS;

type DateSingleOperator = Exclude<DateFilterOperator, typeof DATE_FILTER_OPERATORS.RANGE>;

function getInitialState(currentValue: DateFilterValue | undefined) {
	if (!currentValue) {
		return { value: "", from: "", to: "" };
	}

	if (currentValue.op === DATE_FILTER_OPERATORS.RANGE) {
		return {
			value: "",
			from: currentValue.from ?? "",
			to: currentValue.to ?? "",
		};
	}

	return {
		value: currentValue.value,
		from: "",
		to: "",
	};
}

export interface DateFilterCardProps {
	columnId: string;
	title: string;
	onRemove: () => void;
}

export function DateFilterCard({ columnId, title, onRemove }: DateFilterCardProps) {
	"use no memo";
	const table = useDataTable();
	const column = table.getColumn(columnId);
	const currentValue = column?.getFilterValue() as DateFilterValue | undefined;
	const initial = getInitialState(currentValue);
	const [operator, setOperator] = useState<DateFilterOperator>(currentValue?.op ?? DEFAULT_DATE_OPERATOR);
	const [localValue, setLocalValue] = useState<string>(initial.value);
	const [localFrom, setLocalFrom] = useState<string>(initial.from);
	const [localTo, setLocalTo] = useState<string>(initial.to);

	const isRange = operator === DATE_FILTER_OPERATORS.RANGE;

	if (!column) {
		return null;
	}

	const applySingle = (op: DateSingleOperator, value: string) => {
		column.setFilterValue(value ? ({ op, value } satisfies DateFilterValue) : undefined);
	};

	const applyRange = (from: string, to: string) => {
		if (!from && !to) {
			column.setFilterValue(undefined);
		} else {
			column.setFilterValue({
				op: DATE_FILTER_OPERATORS.RANGE,
				from: from || undefined,
				to: to || undefined,
			} satisfies DateFilterValue);
		}
	};

	const handleOperatorChange = (newOp: DateFilterOperator) => {
		setOperator(newOp);
		setLocalValue("");
		setLocalFrom("");
		setLocalTo("");
		column.setFilterValue(undefined);
	};

	return (
		<>
			<FilterCardHeader title={title} onRemove={onRemove}>
				<OperatorSelect value={operator} onChange={handleOperatorChange} options={DATE_OPERATORS} />
			</FilterCardHeader>

			{isRange ? (
				<div className="flex items-center gap-1.5">
					<Input
						type="date"
						value={localFrom}
						onChange={(e) => {
							setLocalFrom(e.target.value);
							applyRange(e.target.value, localTo);
						}}
						className={DATE_FILTER_INPUT_CLASS}
					/>
					<span className="shrink-0 text-xs text-muted-foreground">to</span>
					<Input
						type="date"
						value={localTo}
						onChange={(e) => {
							setLocalTo(e.target.value);
							applyRange(localFrom, e.target.value);
						}}
						className={DATE_FILTER_INPUT_CLASS}
					/>
				</div>
			) : (
				<Input
					type="date"
					value={localValue}
					onChange={(e) => {
						setLocalValue(e.target.value);
						applySingle(operator as DateSingleOperator, e.target.value);
					}}
					className={DATE_FILTER_INPUT_CLASS}
				/>
			)}
		</>
	);
}
