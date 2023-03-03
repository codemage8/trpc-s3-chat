/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from '../trpc';
import { messageRouter } from './message';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  msg: messageRouter,
});

export type AppRouter = typeof appRouter;
