/* eslint-disable no-underscore-dangle */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Avatar, Flex, HStack, Image, Text, Button,
} from '@chakra-ui/react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { BiArrowBack } from 'react-icons/bi';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import {
  addMsgRoute, getMsgRoute, usersRoute,
} from '../utils/APIRoutes';
import 'react-toastify/dist/ReactToastify.css';
import { toastOptions } from '../utils/toastOptions';
import Contacts from '../components/contacts/Contacts';
import { Users } from '../types/Users';
import Welcome from '../components/welcome/Welcom';
import Chat from '../components/chat/Chat';
import LogOut from '../components/logout/LogOut';
import ChatInput from '../components/chatinput/ChatInput';
import { socket } from '../utils/socket';
import LoadingComponent from '../components/NewFolder/RedirectedScreen';
import { userService } from '../services/userService';
import { accessTokenService } from '../services/accessTokenService';

interface Message {
  fromMe: boolean;
  message: string;
  id: string;
}

export default function Home() {
  const [users, setUsers] = useState<Users[]>([]);
  const [currentUser, setCurrentUser] = useState<Users>();
  const [currentChat, setCurrentChat] = useState<Users>();
  const [contactsScreen, setContactsScreen] = useState('0');
  const [chatScreen, setChatScreen] = useState('-100vw');
  const [selectChat, setSelectChat] = useState('');
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [redirectedScreen, setRedirectedScreen] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    const user = JSON.parse(userService.get() || '');

    if (!user) {
      toast.error('User not found.', toastOptions);
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${accessTokenService.get()}` },
      };
      const { data } = await axios.get(`${usersRoute}/${user._id}`, config);
      setCurrentUser(user);
      setUsers(data);
      setRedirectedScreen(false);
    } catch (error) {
      toast.error('Error connecting to server', toastOptions);
    }
  };

  useEffect(() => {
    const isLoged = accessTokenService.isLoggedIn();
    if (!isLoged) {
      router.replace('/login');
      return;
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    socket.on('msg rcvd', (newMsg) => {
      setMessages([...messages, newMsg]);
    });
  });

  const handleSendmsg = useCallback(
    async (msg: string) => {
      const user = await JSON.parse(userService.get() || '');
      try {
        await axios.post(addMsgRoute, {
          from: currentUser?._id,
          to: currentChat?._id,
          message: msg,
        });
        socket.emit('newMsg', {
          chat: [currentUser?._id, currentChat?._id],
          from: user._id,
          msg,
        });
        setMessages((prev) => [...prev, {
          fromMe: true,
          message: msg,
          id: uuidv4(),
        }]);
      } catch (error) {
        toast.error('Error occured when trying to send message', toastOptions);
      }
    },
    [currentChat, currentUser],
  );

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(getMsgRoute, {
        from: currentUser?._id,
        to: currentChat?._id,
      });
      setMessages(data);
      setLoading(false);
      socket.emit('join chat', { chat: [currentChat?._id, currentUser?._id], user: currentUser?._id });
    } catch (error) {
      setLoading(false);
      toast.error('Error occured when trying to load messages', toastOptions);
    }
  }, [currentChat, currentUser, messages]);

  const exitChat = () => {
    socket.emit('exit chat', [currentChat?._id, currentUser?._id]);
    setContactsScreen('0');
    setChatScreen('-100vw');
    setSelectChat('');
    setCurrentChat(undefined);
  };

  return (
    <div>
      {redirectedScreen ? <LoadingComponent /> : (
        <Flex
          overflow="hidden"
          position="relative"
          gap="1px"
          pl={{ base: '0', md: 12 }}
          pt={12}
          height="100vh"
        >
          <Image
            src="/assets/logo.png"
            alt="picture displaying logo"
            position="absolute"
            top="10px"
            left="10px"
            width="38px"
            height="38px"
          />
          <Contacts
            selectChat={selectChat}
            setSelectChat={setSelectChat}
            setChatScreen={setChatScreen}
            setContactsScreen={setContactsScreen}
            contactsScreen={contactsScreen}
            contacts={users}
            setCurrentChat={setCurrentChat}
          />
          <Flex
            transition="0.5s"
            marginRight={{ base: chatScreen, md: '0' }}
            flexDirection="column"
            flexGrow={1}
          >
            <Flex
              px={4}
              height={{ base: '50px', md: '60px', lg: '70px' }}
              bg="#285E61"
              justify="space-between"
              align="center"
            >
              <Button
                onClick={exitChat}
                display={{ md: 'none' }}
                p={1}
                size="s"
                bg="none"
                color="#38B2AC"
                _active={{
                  opacity: '0.3',
                }}
                _hover={{
                  bg: '#718096',
                  color: '#38B2AC',
                }}
              >
                <BiArrowBack size="24px" />
              </Button>
              <HStack>
                {currentChat && (
                <Avatar
                  size={{ base: 'sm', md: 'md' }}
                  src={currentChat?.avatarImage}
                />
                )}
                <Text
                  color="rgba(255, 255, 255, 0.92)"
                  fontSize={{ base: 'md', md: 'xl', lg: '2xl' }}
                  fontWeight="700"
                  textShadow="1px 1px rgba(0, 0, 0, 0.24)"
                >
                  {currentChat?.userName}
                </Text>
              </HStack>
              <LogOut />
            </Flex>
            {currentChat
              ? (
                <Chat
                  fetchMessages={fetchMessages}
                  messages={messages}
                  loading={loading}
                  currentChat={currentChat}
                />
              )
              : <Welcome />}
            {currentChat && <ChatInput handleSendmsg={handleSendmsg} />}
          </Flex>
          <ToastContainer />
        </Flex>
      )}
    </div>
  );
}
