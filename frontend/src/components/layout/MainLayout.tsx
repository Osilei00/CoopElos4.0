'use client';

import { Box, Flex } from '@chakra-ui/react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useColorMode } from '@/lib/color-mode';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <Flex minH="100vh">
      <Sidebar />
      <Box 
        flex={1} 
        ml="64px"
        bg={isDark ? 'dark.bg.primary' : 'gray.50'}
      >
        <Header />
        <Box as="main" pt="96px" px={8} pb={8}>
          {children}
        </Box>
      </Box>
    </Flex>
  );
}
