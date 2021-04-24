export declare type DateOption = 'equals' | 'greaterThan' | 'greaterThanOrEqual' | 'lessThan' | 'lessThanOrEqual' | 'notEqual' | 'inRange';
export declare type NumberOption = DateOption;
export declare type SetOption = 'in' | 'notIn';
export declare type TextOption = 'equals' | 'notEqual' | 'startsWith' | 'endsWith' | 'contains' | 'notContains';
export declare type FilterType = 'text' | 'set' | 'number' | 'date';

export const TEXT_FILTERS: TextOption[] = ['equals', 'notEqual', 'startsWith', 'endsWith', 'contains', 'notContains'];
export const SET_FILTERS: SetOption[] = ['in', 'notIn'];
export const NUMBER_FILTERS: NumberOption[] = [
  'equals',
  'greaterThan',
  'greaterThanOrEqual',
  'lessThan',
  'lessThanOrEqual',
  'notEqual',
  'inRange',
];
export const DATE_FILTERS: DateOption[] = [...NUMBER_FILTERS];

export const Symbols = {
  equals: '=',
  greaterThan: '>',
  greaterThanOrEqual: '>=',
  lessThan: '<',
  lessThanOrEqual: '<=',
  inRange: '[]',
  in: '{}',
  notIn: '{!}',
  notEqual: '!=',
  startsWith: '^',
  endsWith: '$',
  contains: '%',
  notContains: '!%',
};
export const Shorthand = {
  equals: 'eq',
  greaterThan: 'gt',
  greaterThanOrEqual: 'ge',
  lessThan: 'lt',
  lessThanOrEqual: 'le',
  inRange: 'bt',
  in: 'in',
  notIn: 'ni',
  notEqual: 'ne',
  startsWith: 'sw',
  endsWith: 'ew',
  contains: 'cs',
  notContains: 'nc',
};

export interface IFilter {
  field: string;
  type: FilterType;

  option: TextOption | SetOption | NumberOption | DateOption;
  value: any;
}

export interface IRangeFilter extends IFilter {
  valueTo?: any;
}
