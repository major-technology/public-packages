"use client";

import type { ReactNode } from "react";
import { CheckIcon, XIcon } from "lucide-react";

import { cn } from "../../../lib/utils";
import { Button } from "../../../primitives/button";
import {
	TEXT_FILTER_OPERATORS,
	NUMBER_FILTER_OPERATORS,
	DATE_FILTER_OPERATORS,
	TEXT_OPERATOR_LABELS,
	NUMBER_OPERATOR_LABELS,
	DATE_OPERATOR_LABELS,
} from "../../constants";

export function toOptions<T extends Record<string, string>>(
	map: T,
	labels: Record<string, string>,
): { value: T[keyof T]; label: string }[] {
	return (Object.values(map) as T[keyof T][]).map((value) => ({
		value,
		label: labels[value] ?? value,
	}));
}

export const TEXT_OPERATORS = toOptions(TEXT_FILTER_OPERATORS, TEXT_OPERATOR_LABELS);
export const NUMBER_OPERATORS = toOptions(NUMBER_FILTER_OPERATORS, NUMBER_OPERATOR_LABELS);
export const DATE_OPERATORS = toOptions(DATE_FILTER_OPERATORS, DATE_OPERATOR_LABELS);

export interface RemoveButtonProps {
	onClick: () => void;
}

export function RemoveButton({ onClick }: RemoveButtonProps) {
	return (
		<Button variant="ghost" size="icon-sm" className="h-5 w-5 shrink-0 text-muted-foreground" onClick={onClick}>
			<XIcon className="size-3.5" />
		</Button>
	);
}

export interface OperatorSelectProps<T extends string> {
	value: T;
	onChange: (v: T) => void;
	options: { value: T; label: string }[];
}

export function OperatorSelect<T extends string>({ value, onChange, options }: OperatorSelectProps<T>) {
	return (
		<select
			value={value}
			onChange={(e) => onChange(e.target.value as T)}
			className="h-6 cursor-pointer rounded border border-input bg-background px-1.5 text-xs text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
		>
			{options.map((opt) => (
				<option key={opt.value} value={opt.value}>
					{opt.label}
				</option>
			))}
		</select>
	);
}

export interface FilterCardHeaderProps {
	title: string;
	onRemove: () => void;
	children?: ReactNode;
}

export function FilterCardHeader({ title, onRemove, children }: FilterCardHeaderProps) {
	return (
		<div className="mb-2 flex items-center gap-2">
			<span className="text-xs font-medium">{title}</span>
			{children}
			<div className="flex-1" />
			<RemoveButton onClick={onRemove} />
		</div>
	);
}

export function CheckIndicator({ checked }: { checked: boolean }) {
	return (
		<div
			className={cn(
				"flex size-4 shrink-0 items-center justify-center rounded-sm border shadow-xs",
				checked ? "border-primary bg-primary text-primary-foreground" : "border-input",
			)}
		>
			{checked && <CheckIcon className="size-3.5" />}
		</div>
	);
}

export function CountBadge({ count, className }: { count: number; className?: string }) {
	return (
		<span
			className={cn(
				"flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground",
				className,
			)}
		>
			{count}
		</span>
	);
}
