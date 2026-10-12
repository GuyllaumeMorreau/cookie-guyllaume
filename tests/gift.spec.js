import { test, expect } from "@playwright/test";
import { remainingDays, thaiDate } from "../countdown.js";
test("Paris calendar countdown across Thai midnight, DST and target date", () => {
  expect(remainingDays("2026-12-15", new Date("2026-10-12T12:00:00Z"))).toBe(
    64,
  );
  expect(remainingDays("2026-12-15", new Date("2026-12-14T17:01:00Z"))).toBe(1); // Bangkok already Dec 15.
  expect(remainingDays("2026-12-15", new Date("2026-12-14T22:59:59Z"))).toBe(1);
  expect(remainingDays("2026-12-15", new Date("2026-12-14T23:00:00Z"))).toBe(0);
  expect(remainingDays("2026-12-15", new Date("2026-12-16T12:00:00Z"))).toBe(0);
  expect(remainingDays("2026-10-26", new Date("2026-10-24T22:00:00Z"))).toBe(1);
  expect(thaiDate("2026-12-15")).toContain("2026");
  expect(() => remainingDays("2026-02-30")).toThrow();
});
for (const [name, width, height] of [
  ["mobile", 390, 844],
  ["small-mobile", 320, 640],
  ["desktop", 1440, 1000],
  ["landscape", 844, 390],
]) {
  test(`${name}: all objects, repetitions, Thai font, layout, return and history`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(() => document.fonts.check("16px CookieThai")),
    ).toBeTruthy();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    for (const kind of ["letter", "frame", "cookies", "stars"]) {
      const button = page.locator(`[data-open="${kind}"]`);
      const box = await button.boundingBox();
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
      for (let i = 0; i < 2; i++) {
        await button.click();
        await expect(page.locator("dialog")).toBeVisible();
        if (kind === "letter") {
          await page.locator(".letter-choices button").nth(2).click();
          await expect(page.locator("h2")).toContainText("อยากยิ้ม");
        }
        if (kind === "cookies") {
          const first = await page.locator(".sweet-message").textContent();
          await page.locator(".next").click();
          await expect(page.locator(".sweet-message")).not.toHaveText(first);
        }
        await page.locator(".back").click();
        await expect(page.locator("dialog")).not.toBeVisible();
        await expect(button).toBeFocused();
      }
    }
    await page.locator("[data-open=stars]").click();
    await page.goBack();
    await expect(page.locator("dialog")).not.toBeVisible();
    await page.goForward();
    await expect(page.locator("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog")).not.toBeVisible();
    expect(errors).toEqual([]);
    await page.evaluate(() => document.activeElement.blur());
    await page.screenshot({
      path: `../evidence/${process.env.GIFT_URL ? "public-" : ""}${name}.png`,
      fullPage: true,
      animations: "disabled",
    });
    if (name === "mobile") {
      await page.locator("[data-open=letter]").click();
      await page.screenshot({
        path: "../evidence/letter-mobile.png",
        fullPage: true,
        animations: "disabled",
      });
      await page.locator(".close").click();
      await page.locator("[data-open=cookies]").click();
      await page.screenshot({
        path: "../evidence/cookies-mobile.png",
        fullPage: true,
        animations: "disabled",
      });
    }
  });
}
test("reduced motion, focus containment, orientation and direct link", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#gift-letter");
  await expect(page.locator("dialog")).toBeVisible();
  expect(
    await page
      .locator("dialog")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() =>
        document.querySelector("dialog").contains(document.activeElement),
      ),
    ).toBeTruthy();
  }
  await page.setViewportSize({ width: 844, height: 390 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.locator(".back").click();
  await expect(page.locator("dialog")).not.toBeVisible();
});
test("past-date UI does not assert arrival", async ({ page }) => {
  await page.clock.install({ time: new Date("2026-12-17T10:00:00Z") });
  await page.goto("/");
  await expect(page.locator("#countdown")).toContainText(
    "ถึงวันที่เราวางแผนไว้แล้วนะ",
  );
  await expect(page.locator("#date-note")).toHaveText(
    "เก็บความคิดถึงไว้ในห้องนี้",
  );
});
