/* eslint-disable no-underscore-dangle */
import { Box, VStack } from '@chakra-ui/react';
import React, {
  useCallback,
  useEffect,
} from 'react';
import { Users } from '../../types/Users';
import LoadingComponent from '../NewFolder/RedirectedScreen';
import classes from './Chat.module.css';

interface Message {
  fromMe: boolean;
  message: string;
  id: string;
}

type Props = {
  messages: Message[],
  loading: boolean;
  fetchMessages: () => void;
  currentChat: Users;
};

export default function Chat({
  messages, loading, fetchMessages, currentChat,
}: Props) {
  useEffect(() => {
    fetchMessages();
  }, [currentChat]);

  const setRef = useCallback((node: HTMLDivElement) => {
    if (node) {
      node.scrollIntoView();
    }
  }, []);

  return (
    <VStack
      className={classes.chat}
      overflow="auto"
      p={2}
      bgImage="/assets/bg.jpg"
      height="100%"
    >
      {loading ? <LoadingComponent /> : messages.map((msg, i) => {
        const lastMessage = messages.length - 1 === i;
        return (
          <Box
            ref={lastMessage ? setRef : null}
            alignSelf={msg.fromMe ? 'end' : 'start'}
            key={msg.id}
            rounded="md"
            color="#ffff"
            maxWidth="50vw"
            p={2}
            bg="#718096"
          >
            {msg.message}
          </Box>
        );
      })}
    </VStack>
  );
}
