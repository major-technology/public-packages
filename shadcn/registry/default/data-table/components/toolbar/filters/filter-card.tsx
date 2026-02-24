"use client";

import { SelectFilterCard } from "./cards/select";
import { TextFilterCard } from "./cards/text";
import { NumberFilterCard } from "./cards/number";
import { DateFilterCard } from "./cards/date";
import { BooleanFilterCard } from "./cards/boolean";
import { FILTER_TYPES } from "../../../constants";
import type { DataTableFilterDefinition } from "../../../types";

export interface FilterCardProps {
	definition: DataTableFilterDefinition;
	onRemove: () => void;
}

export function FilterCard({ definition, onRemove }: FilterCardProps) {
	"use no memo";

	return (
		<>
			{definition.type === FILTER_TYPES.SELECT && <SelectFilterCard definition={definition} onRemove={onRemove} />}
			{definition.type === FILTER_TYPES.TEXT && (
				<TextFilterCard columnId={definition.columnId} title={definition.title} onRemove={onRemove} />
			)}
			{definition.type === FILTER_TYPES.NUMBER && (
				<NumberFilterCard columnId={definition.columnId} title={definition.title} onRemove={onRemove} />
			)}
			{definition.type === FILTER_TYPES.DATE && (
				<DateFilterCard columnId={definition.columnId} title={definition.title} onRemove={onRemove} />
			)}
			{definition.type === FILTER_TYPES.BOOLEAN && (
				<BooleanFilterCard columnId={definition.columnId} title={definition.title} onRemove={onRemove} />
			)}
		</>
	);
}
