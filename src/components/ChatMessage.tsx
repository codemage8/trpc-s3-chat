import {
  ActionIcon,
  Alert,
  Group,
  Image,
  Menu,
  Stack,
  Text,
} from '@mantine/core';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import React from 'react';
import { DotsVertical, Trash } from 'tabler-icons-react';
import type { Message } from '~/utils/clientModels';
import { checkFileExists, getSignedUrlForDownload } from '~/utils/s3Service';
import { trpc } from '../utils/trpc';

dayjs.extend(calendar);

export type Props = {
  message: Message;
};

const ChatMessage: React.FC<Props> = (props: Props) => {
  const { message } = props;

  const [imageUrl, setImageUrl] = React.useState<string | null>(null);

  const dateString = React.useMemo(
    () => dayjs(message.createdAt).calendar(),
    [message.createdAt],
  );

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    async function loadImage() {
      if (message.image) {
        if (await checkFileExists(message.image)) {
          setImageUrl(await getSignedUrlForDownload(message.image));
        } else {
          // Try again after a few seconds.
          timeout = setTimeout(loadImage, 3000);
        }
      }
    }
    loadImage().then().catch(console.log);
    console.log('image has changed');
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [message.image]);

  const [hovered, setHovered] = React.useState(false);
  const utils = trpc.useContext();

  const deleteMessageMut = trpc.msg.del.useMutation({
    async onSuccess() {
      // When message is succefully added, invalidate the cache
      utils.msg.list.invalidate();
    },
  });

  const onClickRemoveMessage = async () => {
    try {
      await deleteMessageMut.mutateAsync({ id: message.id });
    } catch (cause) {
      // cause...
    }
  };

  return (
    <>
      <Group
        position="left"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Stack p={0} spacing={2} sx={{ maxWidth: '80%' }}>
          <Group align="center">
            <Stack p={0} spacing={0}>
              <Alert color="indigo">
                <div>{message.content}</div>
              </Alert>
              {message.image ? (
                <Image
                  width={200}
                  height={120}
                  src={imageUrl}
                  fit={'contain'}
                  withPlaceholder
                />
              ) : null}
            </Stack>
            <Stack ml={-10}>
              {hovered ? (
                <Menu position="bottom">
                  <Menu.Target>
                    <ActionIcon radius="xl" color="dark">
                      <DotsVertical size={10} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      onClick={onClickRemoveMessage}
                      color="red"
                      icon={<Trash size={14} />}
                    >
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ) : null}
            </Stack>
          </Group>
          <Text size="xs" color="dimmed">
            {dateString}
          </Text>
        </Stack>
      </Group>
    </>
  );
};

export default ChatMessage;
