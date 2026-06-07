'use client';

import {
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Alert,
  AlertIcon,
  IconButton,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiSun, HiMoon } from 'react-icons/hi2';
import { useColorMode } from '@/lib/color-mode';
import { useQueryClient } from '@tanstack/react-query';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      await queryClient.invalidateQueries({ queryKey: ['session'] });
      router.push('/dashboard');
    } catch (err) {
      setError('Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={isDark ? 'dark.bg.primary' : 'gray.50'}
      position="relative"
    >
      <IconButton
        aria-label="Toggle color mode"
        icon={isDark ? <HiSun /> : <HiMoon />}
        onClick={toggleColorMode}
        position="absolute"
        top={4}
        right={4}
        variant="ghost"
        color={isDark ? 'dark.text.subtle' : 'text.subtle'}
        _hover={{
          bg: isDark ? 'dark.bg.tertiary' : 'gray.100',
        }}
      />

      <Card 
        w="100%" 
        maxW="400px"
        bg={isDark ? 'dark.bg.secondary' : 'white'}
        borderColor={isDark ? 'dark.border.light' : 'border.light'}
      >
        <CardBody>
          <VStack spacing={6}>
            <Box textAlign="center">
              <Heading 
                size="lg" 
                color={isDark ? 'brand.400' : 'brand.500'}
              >
                CoopElos
              </Heading>
              <Text 
                color={isDark ? 'dark.text.subtle' : 'text.subtle'} 
                mt={2}
              >
                Gestão de RH e DP
              </Text>
            </Box>

            {error && (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel 
                    color={isDark ? 'dark.text.secondary' : 'text.secondary'}
                  >
                    Email
                  </FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel 
                    color={isDark ? 'dark.text.secondary' : 'text.secondary'}
                  >
                    Senha
                  </FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="brand"
                  width="100%"
                  isLoading={loading}
                >
                  Entrar
                </Button>
              </VStack>
            </form>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}
