import { createContextInner } from '~/server/context';
import { test, expect } from '@playwright/test';
import { appRouter } from '~/server/routers/_app'; // This will help initialize the prisma from .env
import { MessageListResponse } from '~/utils/clientModels';

test.setTimeout(35e3);

test('test Pagination', async ({ page }) => {
  const ctx = await createContextInner({});
  const caller = appRouter.createCaller(ctx);

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Just wait for 5 seconds to be scrolled to bottom, and then load more indicator presented.
  await page.waitForTimeout(5000);

  // Pagination test...
  let cursor: string | null | undefined = undefined;
  while (true) {
    const messages: MessageListResponse = await caller.msg.list({
      limit: 20,
      cursor,
    });
    for (let i = 0; i < messages.items.length; i++) {
      expect(
        await page
          .locator(`_react=ChatMessage[key='${messages.items[i]?.id}']`)
          .count(),
      ).toBe(1);
    }

    if (!messages.nextCursor) {
      // Pagination finished
      break;
    }

    // scroll into view
    await page.getByTestId('div_chat_load_more').scrollIntoViewIfNeeded();
    // Just wait for 2 seconds to be enough scrolled
    await page.waitForTimeout(2000);
    // And then wait for the network request to be finished
    await page.waitForLoadState('networkidle');

    // Assign the next cursor and repeat
    cursor = messages.nextCursor;
  }
});
