export const FILTER_OPTIONS = [{ value: 'all', label: 'All' }, { value: 'nofill', label: 'No Fill' },
{ value: 'error', label:'Error'}, { value: 'winning', label: 'Winning'}] as const;

export type FilterType = (typeof FILTER_OPTIONS)[number]['value'];

export function parseFilter(raw: string | string[] | undefined): FilterType {
  const match = FILTER_OPTIONS.find((option) => option.value === raw);
  return match ? match.value : "all";
}