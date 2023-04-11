import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { BiPowerOff } from 'react-icons/bi';

export default function LogOut() {
  const router = useRouter();

  const handleLogOut = () => {
    localStorage.clear();
    router.replace('/login');
  };
  return (
    <Button
      size="s"
      p={1}
      type="button"
      bg="#9B2C2C"
      color="#FFFFFF"
      onClick={handleLogOut}
      _hover={{
        bg: '#718096',
        color: '#000000',
      }}
    >
      <BiPowerOff />
    </Button>
  );
}
