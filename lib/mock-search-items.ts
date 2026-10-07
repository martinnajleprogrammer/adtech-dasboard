// Mock catalog for the typeahead exercise. Replace with a real data source later.
export const mockSearchItems: string[] = [
  "react", "reactive", "preact", "create-react-app", "react-native", "react-query", "react-router", "react-hook-form",
  "redux", "redux-toolkit", "recoil", "remix", "rollup", "redis", "restify", "rxjs",
  "angular", "alpine.js", "astro", "axios", "apollo-client", "ant-design",
  "next.js", "nuxt", "node.js", "nest.js", "npm", "nx",
  "vue", "vite", "vitest", "vercel", "vuex", "volta",
  "svelte", "solid-js", "storybook", "styled-components", "swr", "supabase",
  "typescript", "tailwindcss", "trpc", "turborepo", "tanstack-table", "three.js",
  "webpack", "web-components", "websocket", "playwright", "prisma", "postcss",
  "jest", "jquery", "jotai", "eslint", "express", "esbuild", "graphql", "gatsby",
];

export type SearchResponse = { results: string[]; total: number };

export const searchMockItems = (query: string, limit: number): SearchResponse => {
  const q = query.trim().toLowerCase();
  const matches = mockSearchItems.filter((item) => item.toLowerCase().includes(q));

  const startsWith = matches.filter((item) => item.toLowerCase().startsWith(q)).sort();
  const contains = matches.filter((item) => !item.toLowerCase().startsWith(q)).sort();

  const ranked = [...startsWith, ...contains];
  return { results: ranked.slice(0, limit), total: ranked.length };
};
