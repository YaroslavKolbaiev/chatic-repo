import {
  Center,
  Image,
  ScaleFade,
  useDisclosure,
  Heading,
  VStack,
  Flex,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';

function ScaleFadeEx() {
  const { isOpen, onToggle } = useDisclosure();

  useEffect(() => {
    onToggle();
  }, []);

  return (
    <ScaleFade initialScale={0.1} in={isOpen}>
      <Flex gap={2} justify="center" align="center">
        <Heading textAlign="center" size={{ base: 's', md: 'lg', lg: 'xl' }}>
          Welcome to
        </Heading>
        <Image
          src="/assets/logo-no-background.svg"
          alt="picture displaying logo"
          width="180px"
          height="60px"
        />
      </Flex>
      <Center>
        <Image src="/assets/🤖 Robot Waving.gif" alt="welcome bot" />
      </Center>
    </ScaleFade>
  );
}

export default function Welcome() {
  return (
    <Center flexGrow={1}>
      <VStack>{ScaleFadeEx()}</VStack>
    </Center>
  );
}
