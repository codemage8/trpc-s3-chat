import { expect, test } from 'vitest';
import { createContextInner } from '../context';
import { prisma } from '../prisma'; // CAUTION!: This import should be after the appRouter
import { appRouter } from './_app';

test('pagination test', async () => {
  const ctx = await createContextInner({});
  const caller = appRouter.createCaller(ctx);

  const total = await prisma.message.count();

  // Make sure it has more than 11 items
  expect(total).toBeGreaterThan(11);

  const allData = await caller.msg.list({
    limit: total + 1,
  });
  expect(allData.items.length).toBe(total);

  const data10 = await caller.msg.list({
    limit: 10,
  });
  expect(data10.items.length).toBe(10);

  // next cursor should exist
  expect(data10.nextCursor).not.toBeNull();

  const data11 = await caller.msg.list({
    limit: 11,
  });
  expect(data11.items.length).toBe(11);

  // next cursor should be the 1st item of the page with +1 length
  expect(data10.nextCursor).toBe(data11.items[0]?.id);
}, 10000); // wait for 10 seconds
