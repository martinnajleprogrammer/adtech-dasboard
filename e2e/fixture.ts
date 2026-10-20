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
// Checks that the element has keyboard focus AND that the browser draws a focus indicator on it.
// We assert the ring was not removed (e.g. by `outline-none`), not a browser-specific value.
const expectFocusRing = async (locator: Locator) => {
  await expect(locator).toBeFocused();
  await expect(locator).not.toHaveCSS('outline-style', 'none');
  await expect(locator).not.toHaveCSS('outline-width', '0px');
};


export const test = base.extend<{ typeahead: TypeAhead }>({
  typeahead: async ({ page }, use) => {
    // setup
    await use(new TypeAhead(page));
    // teardown (si hace falta)
  },
});

export { expect, expectFocusRing };