'use client';

import React, { Fragment } from 'react';
import { trpc } from '../utils/trpc';
import { ScrollArea, Stack } from '@mantine/core';
import ChatInputBox from './ChatInputBox';
import ChatMessage from './ChatMessage';

const ChatRoom = () => {
  const scrollViewport = React.useRef<HTMLDivElement>(null);
  const msgQuery = trpc.msg.list.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getPreviousPageParam(lastPage) {
        return lastPage.nextCursor;
      },
      refetchInterval: 5000,
    },
  );

  React.useEffect(() => {
    if (msgQuery.status === 'success') {
      // Scroll to bottom when messages are loaded
      scrollViewport.current?.scrollTo({
        top: scrollViewport.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [msgQuery.status]);

  return (
    <>
      <Stack sx={{ height: '84vh' }} p={0}>
        <ScrollArea
          p="xs"
          scrollbarSize={1}
          sx={{ height: '84vh' }}
          onScrollPositionChange={({ x, y }) => {
            if (y == 0) {
              msgQuery.fetchPreviousPage();
            }
          }}
          viewportRef={scrollViewport}
        >
          {
            <Stack>
              {msgQuery.data?.pages.map((page, index) => {
                return (
                  <Fragment key={page.items[0]?.id || index}>
                    {page.items.map((msg) => {
                      return <ChatMessage message={msg} key={msg.id} />;
                    })}
                  </Fragment>
                );
              })}
            </Stack>
          }
        </ScrollArea>
        <ChatInputBox scrollViewRef={scrollViewport} />
      </Stack>
    </>
  );
};

export default ChatRoom;
