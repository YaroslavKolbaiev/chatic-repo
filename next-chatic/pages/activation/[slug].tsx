import {
  Box, Container, Heading, Link, Text,
} from '@chakra-ui/react';
import React, {
  // useContext,
  useEffect,
  useState,
} from 'react';
import LoadingComponent from '../../components/NewFolder/RedirectedScreen';
import { accessTokenService } from '../../services/accessTokenService';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';

type Props = {
  activationToken: string,
};

export default function AccountActivationPage({ activationToken }: Props) {
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    authService.activate(activationToken)
      .then(({ accessToken, user }: any) => {
        accessTokenService.save(accessToken);
        userService.save(user);
      })
      .catch(() => {
        setError('There was an issue with activation link');
      })
      .finally(() => {
        setDone(true);
      });
  }, [activationToken]);

  if (!done) {
    return <LoadingComponent />;
  }

  return (
    <Container pt="8" maxW="container.sm">
      <Box boxShadow="2xl" p="6" rounded="md">
        <Heading textAlign="center">Account activation</Heading>

        {error ? (
          <Text p={3} fontSize="3xl">
            {error}
          </Text>
        ) : (
          <Text p={3} fontSize="3xl">
            Your account is now active. Please proceed to
            {' '}
            <Link color="teal.500" href="/avatar">chose your avatar</Link>
            .
          </Text>
        )}
      </Box>
    </Container>
  );
}

export function getServerSideProps(context: any) {
  const { params } = context;
  const activationToken = params.slug;

  return {
    props: {
      activationToken,
    },
  };
}
