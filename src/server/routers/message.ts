/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { prisma } from '~/server/prisma';
import { deleteFile, getSignedUrlForUpload } from '../services/s3bucket';
import { publicProcedure, router } from '../trpc';

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultMessageSelect = Prisma.validator<Prisma.MessageSelect>()({
  id: true,
  content: true,
  image: true,
  createdAt: true,
});

export const messageRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const items = await prisma.message.findMany({
        select: defaultMessageSelect,
        // get an extra item at the end for the next cursor
        take: limit + 1,
        where: {},
        cursor: input.cursor
          ? {
              id: input.cursor,
            }
          : undefined,
        orderBy: {
          createdAt: 'desc',
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        // Remove the last item and use it as next cursor

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const nextItem = items.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        items: items.reverse(),
        nextCursor,
      };
    }),

  add: publicProcedure
    .input(
      z.object({
        content: z.string().trim(),
        hasImage: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const messageInput: Prisma.MessageCreateInput = {
        content: input.content,
      };
      let uploadUrl = null;
      if (input.hasImage) {
        const key = randomUUID();
        uploadUrl = await getSignedUrlForUpload(key);
        messageInput.image = key;
      }
      const message = await prisma.message.create({
        data: messageInput,
        select: defaultMessageSelect,
      });
      // Return upload url
      return {
        message,
        uploadUrl,
      };
    }),

  del: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const removed = await prisma.message.delete({
        where: {
          id: input.id,
        },
      });
      if (removed.image) {
        try {
          // Remove from s3 bucket
          await deleteFile(removed.image);
        } catch (exception) {
          // process exception
          console.log(exception);
        }
      }
    }),
});
