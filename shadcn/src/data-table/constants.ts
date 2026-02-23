export const DATA_TABLE_VERSION = "1.0.0";

export const SORT_DIRECTION = {
	ASC: "asc",
	DESC: "desc",
} as const;

export const DEFAULT_PAGE_SIZE = 50;

export const SEARCH_DEBOUNCE_MS = 300;

export const FILTER_INPUT_CLASS = "h-7 px-2 text-xs";
export const DATE_FILTER_INPUT_CLASS = "h-7 px-1.5 text-xs";

export const SKELETON_ROW_COUNT = 5;

export const SELECT_COLUMN_ID = "_select";

export const ACTIONS_COLUMN_ID = "_actions";

export const EXPAND_COLUMN_ID = "_expand";

export const FILTER_TYPES = {
	SELECT: "select",
	TEXT: "text",
	NUMBER: "number",
	DATE: "date",
	BOOLEAN: "boolean",
} as const;

export const TEXT_FILTER_OPERATORS = {
	CONTAINS: "contains",
	EQUALS: "eq",
	STARTS_WITH: "starts_with",
	ENDS_WITH: "ends_with",
	NOT_EQUALS: "neq",
} as const;

export const NUMBER_FILTER_OPERATORS = {
	EQUALS: "eq",
	LESS_THAN: "lt",
	GREATER_THAN: "gt",
	RANGE: "range",
	NOT_EQUALS: "neq",
} as const;

export const DATE_FILTER_OPERATORS = {
	EQUALS: "eq",
	BEFORE: "before",
	AFTER: "after",
	RANGE: "range",
	NOT_EQUALS: "neq",
} as const;

export const FILTER_TYPE_LABELS = {
	[FILTER_TYPES.SELECT]: "Select",
	[FILTER_TYPES.TEXT]: "Text",
	[FILTER_TYPES.NUMBER]: "Number",
	[FILTER_TYPES.DATE]: "Date",
	[FILTER_TYPES.BOOLEAN]: "Boolean",
};

export const TEXT_OPERATOR_LABELS = {
	[TEXT_FILTER_OPERATORS.CONTAINS]: "Contains",
	[TEXT_FILTER_OPERATORS.EQUALS]: "Equals",
	[TEXT_FILTER_OPERATORS.STARTS_WITH]: "Starts with",
	[TEXT_FILTER_OPERATORS.ENDS_WITH]: "Ends with",
	[TEXT_FILTER_OPERATORS.NOT_EQUALS]: "Not equals",
};

export const NUMBER_OPERATOR_LABELS = {
	[NUMBER_FILTER_OPERATORS.EQUALS]: "Equals",
	[NUMBER_FILTER_OPERATORS.LESS_THAN]: "Less than",
	[NUMBER_FILTER_OPERATORS.GREATER_THAN]: "Greater than",
	[NUMBER_FILTER_OPERATORS.RANGE]: "In range",
	[NUMBER_FILTER_OPERATORS.NOT_EQUALS]: "Not equals",
};

export const DATE_OPERATOR_LABELS = {
	[DATE_FILTER_OPERATORS.EQUALS]: "Equals",
	[DATE_FILTER_OPERATORS.BEFORE]: "Before",
	[DATE_FILTER_OPERATORS.AFTER]: "After",
	[DATE_FILTER_OPERATORS.RANGE]: "In range",
	[DATE_FILTER_OPERATORS.NOT_EQUALS]: "Not equals",
};
