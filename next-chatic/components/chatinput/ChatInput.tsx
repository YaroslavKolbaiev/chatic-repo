import React, { useState } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { IoMdSend } from 'react-icons/io';
import { BsEmojiSmile } from 'react-icons/bs';
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Box,
} from '@chakra-ui/react';

type Props = {
  handleSendmsg: (value: string) => void;
};

export default function ChatInput({ handleSendmsg }: Props) {
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [msg, setMsg] = useState('');

  const handleEmoji = () => {
    setIsEmojiOpen(!isEmojiOpen);
  };

  const handleEmojiClick = (emoji: EmojiClickData) => {
    let message = msg;

    message += emoji.emoji;

    setMsg(message);
  };

  const sendChat = () => {
    if (msg.length > 0) {
      handleSendmsg(msg);
      setMsg('');
    }
  };

  return (
    <InputGroup
      position="relative"
      bg="#285E61"
      minH={{ base: '40px', md: '50px', lg: '55px' }}
    >
      {isEmojiOpen && (
        <Box width={{ base: '100%', md: '500px' }} position="absolute" top="-400px">
          <EmojiPicker
            emojiVersion="2.0"
            height={400}
            width="100%"
            onEmojiClick={handleEmojiClick}
          />
        </Box>
      )}
      <InputLeftElement>
        <Button
          onClick={handleEmoji}
          borderRadius="full"
          size="s"
          type="button"
          bg="#f8de7e"
          _hover={{
            bg: '#f8de7e',
            transform: 'scale(1.2)',
          }}
        >
          <BsEmojiSmile size={20} />
        </Button>
      </InputLeftElement>
      <Input
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        variant="unstyled"
        textColor="#FFFFFF"
        placeholder="type a message"
        fontSize="16px"
      />
      <InputRightElement>
        <Button
          onClick={sendChat}
          transition="0.2s"
          p={0}
          type="button"
          color="#CBD5E0"
          bg="none"
          _hover={{
            bg: 'none',
            color: '#CBD5E0',
          }}
          _active={{
            opacity: '0.3',
          }}
        >
          <IoMdSend size={24} />
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}
