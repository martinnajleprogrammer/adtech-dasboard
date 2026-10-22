// lib/forced-failure.ts

export const getForcedFailSlot = (
  param: string | string[] | undefined,
  flag: string | undefined,
): string | null => {

  if (flag !== '1') return null;

  if (!param || Array.isArray(param)) return null;
  
  return param;
};
