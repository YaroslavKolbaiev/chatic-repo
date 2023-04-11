import React, { useEffect, useState } from 'react';
import {
  Center, Text, Box, Image, Button, Wrap, WrapItem,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { AvatarGenerator } from 'random-avatar-generator';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { toastOptions } from '../../utils/toastOptions';
import { avatarRoute } from '../../utils/APIRoutes';
import { accessTokenService } from '../../services/accessTokenService';
import { userService } from '../../services/userService';

interface Avatars {
  avatar: string,
  id: string,
}

export default function SetAvatar() {
  const [avatar, setAvatar] = useState<Avatars[]>([]);
  const [avatarPicker, setAvatarPicker] = useState<string>('');
  const router = useRouter();

  const generateAvatars = () => {
    const data = [];
    for (let i = 0; i < 4; i += 1) {
      const randomNumber = Math.floor(Math.random() * 100).toString();
      const generator = new AvatarGenerator().generateRandomAvatar(randomNumber);
      data.push({ avatar: generator, id: `id${i}` });
    }

    setAvatar(data);
  };

  useEffect(() => {
    const isLoged = accessTokenService.isLoggedIn();
    if (!isLoged) {
      router.replace('/login');
      return;
    }
    generateAvatars();
  }, []);

  const setProfileImage = async () => {
    const user = await JSON.parse(userService.get() || '');
    if (!user) {
      toast.error('User not found.', toastOptions);
      return;
    }

    const selectedAvatar = avatar.find((ava) => ava.id === avatarPicker);

    try {
      const { data } = await axios.post(`${avatarRoute}/${user.email}`, {
        image: selectedAvatar?.avatar,
      });

      if (data.isSet) {
        router.replace('/');
      }
    } catch (error) {
      toast.error('Error occured. Please try again.', toastOptions);
    }
  };

  return (
    <Box p={12} height="100vh">
      <Center>
        <Box bg="white" rounded="md" boxShadow="2xl" p={8}>
          <Text mb={8} textAlign="center" fontSize="3xl" fontWeight="bold">
            Chose your avatar
          </Text>
          <Wrap mb={8}>
            {avatar.map((ava) => (
              <WrapItem key={ava.id}>
                <Image
                  onClick={() => {
                    setAvatarPicker((current) => {
                      if (current === ava.id) {
                        return '';
                      }

                      return ava.id;
                    });
                  }}
                  _hover={{
                    cursor: 'pointer',
                  }}
                  bgGradient={avatarPicker === ava.id ? 'radial(circle, #ED8936 10%, #FFFFFF 78%)' : 'transparent'}
                  rounded="full"
                  p={1}
                  width={100}
                  height={100}
                  src={ava.avatar}
                  alt="avatar"
                />
              </WrapItem>
            ))}
          </Wrap>
          <Center>
            { avatarPicker === '' ? (
              <Button colorScheme="teal" type="button" onClick={generateAvatars}>
                Generate avatar
              </Button>
            ) : (
              <Button colorScheme="orange" type="button" onClick={setProfileImage}>
                Confirm avatar
              </Button>
            ) }
          </Center>
        </Box>
      </Center>
      <ToastContainer />
    </Box>
  );
}
