import { trpc } from '../utils/trpc';

function useMessagesQuery(
  // The reason for limit parameter is mandatory is to make optimistic mechanism working.
  limit: number,
  refetchInterval?: number | null,
) {
  return trpc.msg.list.useInfiniteQuery(
    {
      limit,
    },
    {
      getPreviousPageParam(lastPage) {
        return lastPage.nextCursor;
      },
      refetchInterval: refetchInterval ?? 10000,
    },
  );
}

export default useMessagesQuery;
