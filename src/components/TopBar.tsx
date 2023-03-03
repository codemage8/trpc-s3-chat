import { Group, Paper, Text, Title } from '@mantine/core';
import { MessageCircle } from 'tabler-icons-react';

const TopBar = () => {
  return (
    <>
      <Paper
        radius={0}
        sx={{ boxShadow: '0px 2px 0px 0px rgba(173,181,189,.5)' }}
      >
        <Group
          position="apart"
          p="sm"
          align="center"
          sx={{ height: '8vh' }}
          noWrap
        >
          <Text
            variant="gradient"
            gradient={{ from: 'red', to: 'blue', deg: 90 }}
          >
            <Group align="center" noWrap spacing={3}>
              <Title>TRPC Text App</Title>
              <MessageCircle color="green" size={30} />
            </Group>
          </Text>
        </Group>
      </Paper>
    </>
  );
};

export default TopBar;
