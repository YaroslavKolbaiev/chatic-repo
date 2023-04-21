import React, { useEffect, useState } from 'react';
import {
  Container,
  Input,
  Box,
  Button,
  Center,
  Flex,
  VStack,
  Spinner,
} from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import axios from 'axios';
import { useRouter } from 'next/navigation';
// import { loginRoute } from '../../utils/APIRoutes';
import { toastOptions } from '../../utils/toastOptions';
import { accessTokenService } from '../../services/accessTokenService';
import { authService } from '../../services/authService';
import { userService } from '../../services/userService';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();

  useEffect(() => {
    const isLoged = accessTokenService.isLoggedIn();
    if (isLoged) {
      router.replace('/');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const { email, password } = values;

    try {
      const { accessToken, user }: any = await authService.login({ email, password });
      accessTokenService.save(accessToken);
      userService.save(user);
      router.replace('/');
      setIsLoading(false);
    } catch (error: any) {
      toast.error(error.response.data.message, toastOptions);
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <Box pt="20vh" height="100vh">
      <Container p={4}>
        <Box bg="white" px={16} py={8} rounded="md" boxShadow="2xl">
          <form onSubmit={handleSubmit}>
            <Flex justifyContent="center" alignItems="center">
              <Image
                src="/assets/logo-no-background.svg"
                alt="picture displaying logo"
                width={120}
                height={100}
              />
            </Flex>
            <VStack spacing={4}>
              <Input
                required
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
              />
              <Input
                required
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
              />
              <Button width="100%" type="submit" colorScheme="teal">
                {isLoading ? <Spinner /> : 'Login'}
              </Button>
            </VStack>
          </form>
          <Center mt={3}>
            <span>
              don&apos;t have an account ?
              {' '}
              <Link style={{ color: 'blue' }} href="/register">Sign-Up</Link>
            </span>
          </Center>
        </Box>
      </Container>
      <ToastContainer />
    </Box>
  );
}
