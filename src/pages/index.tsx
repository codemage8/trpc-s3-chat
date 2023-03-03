import { Container } from '@mantine/core';
import ChatRoom from '~/components/ChatRoom';
import { NextPageWithLayout } from './_app';
import TopBar from '~/components/TopBar';

const IndexPage: NextPageWithLayout = () => {
  return (
    <Container>
      <TopBar />
      <ChatRoom />
    </Container>
  );
};

export default IndexPage;
