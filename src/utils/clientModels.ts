import type { RouterInput, RouterOutput } from './trpc';

type MessageListResponse = RouterOutput['msg']['list'];
type Message = MessageListResponse['items'][number];
type MessageAddResponse = RouterOutput['msg']['add'];

export type {
  RouterInput,
  RouterOutput,
  MessageListResponse,
  Message,
  MessageAddResponse,
};
