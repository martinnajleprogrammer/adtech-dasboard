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

// Page object for the dashboard: locators and waits. Navigation stays in each test (URLs vary).
class Dashboard {
  readonly header: Locator;
  readonly cards: Locator;
  readonly skeletons: Locator;
  readonly filter: Locator;
  constructor(private readonly page: Page) {
    this.header = page.getByRole('banner');
    this.cards = page.getByRole('article');
    this.skeletons = page.getByRole('status', { name: 'Loading ad slot'});
    this.filter = page.getByLabel('Filter by status:');
  }

  // All Suspense boundaries resolved: no skeletons left and the expected number of cards.
  // 6 is the number of mock slots, hardcoded on purpose so the test fails if the product changes.
  async waitForStreamed(expectedCards = 6) {
    await expect(this.skeletons).toHaveCount(0);
    await expect(this.cards).toHaveCount(expectedCards);
  }
  // For axe: auditing mid-animation (card fade-in) measures blended colors and reports false contrast errors.
  // Must run after the skeletons are gone: their infinite animation rejects `finished` on unmount.
  async waitForStable(expectedCards = 6) {
    await this.waitForStreamed(expectedCards);
    await this.page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
  }
  cardLink(name: string) { 
    return this.page.getByRole('link', { name, exact: true });
  }
}

class SlotDetail {
  readonly title: Locator;
  readonly backLink: Locator;
  readonly currentRound: Locator;
  readonly skeleton: Locator;
  readonly history: Locator;
  readonly historyRows: Locator;
  readonly errorAlert: Locator;
  readonly retryButton: Locator;
  readonly historyRegion: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByRole('heading', { level: 1 });
    this.backLink = page.getByRole('link', { name: 'Back to dashboard' });
    this.currentRound = page.getByRole('region', { name: 'Current round' });
    this.skeleton = page.getByRole('status', { name: 'Loading current round' });
    this.history = page.getByRole('table', { name: /history/i });
    this.historyRows = this.history.getByRole('row').filter({ has: page.getByRole('rowheader') });
    this.errorAlert = page.getByRole('alert').filter({ hasText: /error occurred/i });
    this.retryButton = page.getByRole('button', { name: 'Retry' });
    this.historyRegion = page.getByRole('region', { name: /history/i });
  }
  async waitForLoaded() {
    await expect(this.skeleton).toHaveCount(0);
    await expect(this.currentRound).toBeVisible();
  }

  async open(slotId: string, search = '') { 
    return this.page.goto(`/slots/${slotId}${search}`, { waitUntil: 'commit' });
     
  }

}


// Checks that the element has keyboard focus AND that the browser draws a focus indicator on it.
// We assert the ring was not removed (e.g. by `outline-none`), not a browser-specific value.
const expectFocusRing = async (locator: Locator) => {
  await expect(locator).toBeFocused();
  await expect(locator).not.toHaveCSS('outline-style', 'none');
  await expect(locator).not.toHaveCSS('outline-width', '0px');
};


type Fixtures = {
  typeahead: TypeAhead;
  dashboard: Dashboard;
  slotDetail: SlotDetail;
};

export const test = base.extend<Fixtures>({

  typeahead: async ({ page }, use) => {

    const typeahead = new TypeAhead(page);

    await use(typeahead);

  },

  dashboard: async ({ page }, use) => {

    const dashboard = new Dashboard(page);

    await use(dashboard);

  },
  
  slotDetail: async ({ page }, use) => {

    const slotDetail = new SlotDetail(page);

    await use(slotDetail);

  },

});

export { expect, expectFocusRing };