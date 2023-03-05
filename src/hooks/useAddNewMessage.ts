import { InfiniteData } from '@tanstack/react-query';
import { MessageListResponse } from '~/utils/clientModels';
import { trpc } from '../utils/trpc';

interface OptimisticUpdateContext {
  previousData?: InfiniteData<MessageListResponse>;
}

function useAddNewMessage(limit: number, afterMutation?: () => void) {
  const utils = trpc.useContext();
  return trpc.msg.add.useMutation<OptimisticUpdateContext>({
    async onError(error, input, context) {
      // Revert back to the previous data
      utils.msg.list.setInfiniteData(
        {
          limit,
        },
        context?.previousData,
      );
    },
    async onMutate(input) {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await utils.msg.list.cancel();

      // Snapshot the previous
      // Since adding messages to the latest cursor should be nul
      const previousData = utils.msg.list.getInfiniteData({
        limit,
      });

      // Optimistically update
      const newMessage = {
        content: input.content,
        image: input.hasImage ? 'placeholder-image' : null,
        id: `${Math.random()}`, // Just use random number for now
        createdAt: new Date(),
      };
      utils.msg.list.setInfiniteData(
        {
          limit,
        },
        previousData
          ? {
              ...previousData,
              pages: previousData.pages.map((page) => ({
                ...page,
                items: [...page.items, newMessage],
              })),
            }
          : {
              pages: [
                {
                  items: [newMessage],
                  nextCursor: undefined,
                },
              ],
              pageParams: Array<unknown>(undefined),
            },
      );

      // call afterMutation
      afterMutation?.();

      // As the context, return the previous data
      return { previousData };
    },
    // Always refetch after error or success:
    async onSettled() {
      // When message is succefully added, invalidate the cache
      await utils.msg.list.invalidate();
    },
  });
}

export default useAddNewMessage;
