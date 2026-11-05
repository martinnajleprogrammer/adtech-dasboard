import { expect, test } from "./fixture";

[360, 412, 768].forEach((width: number) => {
  test(`Skeleton vs card heights for ${width}`, async ({ page, dashboard }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/', { waitUntil: 'commit' });

    await expect(dashboard.header).toHaveCSS('display', 'flex'); // CSS applied
    await expect(dashboard.skeletons.first()).toBeVisible();
    const before = await dashboard.skeletons.first().boundingBox();

    await dashboard.waitForStreamed();
    const after = await dashboard.cards.first().boundingBox();

    await expect(before!.height).toBe(after!.height);
    await expect(before!.width).toBe(after!.width);
  });
});
