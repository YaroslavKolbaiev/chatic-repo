/* eslint-disable no-underscore-dangle */
import {
  Box, Heading, VStack, Avatar, Text, HStack,
} from '@chakra-ui/react';
import React from 'react';
import { Users } from '../../types/Users';
import classes from './Contacts.module.css';

type Props = {
  contacts: Users[];
  setCurrentChat: (value: Users) => void;
  contactsScreen: string;
  setContactsScreen: (value: string) => void;
  setChatScreen: (value: string) => void;
  selectChat: string;
  setSelectChat: (value: string) => void;
};

export default function Contacts({
  contacts,
  setCurrentChat,
  contactsScreen,
  setContactsScreen,
  setChatScreen,
  selectChat,
  setSelectChat,
}: Props) {
  const handleChat = (userId: string, contact: Users) => {
    setSelectChat(userId);
    setCurrentChat(contact);
    setContactsScreen('-100vw');
    setChatScreen('0');
  };

  return (
    <Box
      marginLeft={{ base: contactsScreen, md: '0' }}
      transition="0.5s"
      width={{ base: '100vw', md: '280px' }}
      p={4}
      bg="#285E61"
      borderTopLeftRadius="20px"
      overflowX="hidden"
      overflowY="scroll"
      className={classes.contacts}
    >
      <Heading
        color="rgba(255, 255, 255, 0.92)"
        mb={4}
        size={{ base: 'md', md: 'lg', lg: 'xl' }}
      >
        Contacts
      </Heading>
      <VStack
        spacing={4}
      >
        {contacts.map((contact) => (
          <HStack
            onClick={() => {
              handleChat(contact._id, contact);
            }}
            p={2}
            width="100%"
            rounded="md"
            key={contact._id}
            transition="0.5s"
            bg={selectChat === contact._id ? '#38B2AC' : ''}
            _hover={{
              bg: '#718096',
              cursor: 'pointer',
            }}
          >
            <Avatar size={{ base: 'sm', md: 'md' }} src={contact.avatarImage} />
            <Text
              color="rgba(255, 255, 255, 0.92)"
              fontSize={{ base: 'md', md: 'xl', lg: '2xl' }}
              fontWeight="700"
              textShadow="1px 1px rgba(0, 0, 0, 0.24)"
            >
              {contact.userName}
            </Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}
