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
  Heading,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastOptions } from '../../utils/toastOptions';
import { authService } from '../../services/authService';
import { accessTokenService } from '../../services/accessTokenService';

export default function Register() {
  const [values, setValues] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const router = useRouter();
  const [registered, setRegistered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const isLoged = accessTokenService.isLoggedIn();
    if (isLoged) {
      router.replace('/');
    }
  }, []);

  const handleValidation = () => {
    const {
      password, confirmPassword, userName,
    } = values;

    if (password !== confirmPassword) {
      toast.error('password and confirm password must be the same.', toastOptions);
      return false;
    }

    if (userName.length < 3) {
      toast.error('Username must be greater than 3 characters', toastOptions);
      return false;
    }

    if (password.length < 6) {
      toast.error('Password must be greater than 6 characters', toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (handleValidation()) {
      const {
        password, userName, email,
      } = values;
      setIsSubmitting(true);
      try {
        await authService.register({ userName, email, password });
        setRegistered(true);
        setIsSubmitting(false);
      } catch (error: any) {
        if (error.message === 'Network Error') {
          toast.error('We have some issues on the server. Please try again later.', toastOptions);
          setIsSubmitting(false);
          return;
        }
        toast.error(error.response.data.message, toastOptions);
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  if (registered) {
    return (
      <Container pt="8" maxW="container.sm">
        <Box boxShadow="2xl" p="6" rounded="md">
          <Heading textAlign="center">Check your email</Heading>
          <Text p={3} fontSize="3xl">
            We have sent you an email with the activation link.
          </Text>
        </Box>
      </Container>
    );
  }

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
                placeholder="Username"
                name="userName"
                onChange={handleChange}
              />
              <Input
                required
                type="email"
                placeholder="E-Mail"
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
              <Input
                required
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                onChange={handleChange}
              />
              <Button
                width="100%"
                type="submit"
                colorScheme="teal"
              >
                {isSubmitting ? <Spinner /> : 'Create User'}
              </Button>
            </VStack>
          </form>
          <Center mt={3}>
            <span>
              already have an account ?
              {' '}
              <Link style={{ color: 'blue' }} href="/login">Login</Link>
            </span>
          </Center>
        </Box>
      </Container>
      <ToastContainer />
    </Box>
  );
}
