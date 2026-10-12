// e2e/fixture.ts
import { test as base, expect, type Locator, type Page } from '@playwright/test';

class TypeAhead {
  readonly input: Locator;
  readonly listbox: Locator;
  constructor(private readonly page: Page) {
    this.listbox = page.getByRole('listbox');
    this.input = page.getByRole('combobox', { name: 'Search tools' });
  }
  async search(text: string) {
    await this.input.fill(text);
  }
}

export const test = base.extend<{ typeahead: TypeAhead }>({
  typeahead: async ({ page }, use) => {
    // setup
    await use(new TypeAhead(page));
    // teardown (si hace falta)
  },
});

export { expect };