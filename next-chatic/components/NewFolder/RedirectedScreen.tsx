import { Center, Spinner } from '@chakra-ui/react';
import React from 'react';

export default function LoadingComponent() {
  return (
    <Center h="100vh">
      <Spinner
        thickness="4px"
        speed="0.95s"
        emptyColor="gray.200"
        color="blue.500"
        height="180px"
        width="180px"
      />
    </Center>
  );
}
