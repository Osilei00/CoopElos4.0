'use client';

import { Box, Flex, Text, Avatar, Menu, MenuButton, MenuList, MenuItem, IconButton } from '@chakra-ui/react';
import { usePathname, useRouter } from 'next/navigation';
import { HiSun, HiMoon, HiArrowRightOnRectangle } from 'react-icons/hi2';
import { useColorMode } from '@/lib/color-mode';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/collaborators': 'Colaboradores',
  '/payroll': 'Folha de Pagamento',
  '/timesheets/hospital': 'Ponto Hospitalar',
  '/timesheets/sad': 'Ponto SAD',
  '/patients': 'Pacientes',
  '/vacations': 'Férias',
  '/tasks': 'Tarefas',
  '/audit': 'Auditoria',
  '/users': 'Usuários',
  '/settings': 'Configurações',
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const title = pageTitles[pathname] || 'CoopElos';
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <Box
      h="64px"
      bg={isDark ? 'dark.bg.secondary' : 'white'}
      borderBottom="1px solid"
      borderColor={isDark ? 'dark.border.light' : 'border.light'}
      position="fixed"
      top={0}
      left="64px"
      right={0}
      zIndex={20}
    >
      <Flex
        h="100%"
        px={8}
        alignItems="center"
        justifyContent="space-between"
      >
        <Text 
          fontSize="xl" 
          fontWeight="600" 
          color={isDark ? 'dark.text.primary' : 'text.primary'}
        >
          {title}
        </Text>

        <Flex alignItems="center" gap={4}>
          <IconButton
            aria-label="Toggle color mode"
            icon={isDark ? <HiSun /> : <HiMoon />}
            onClick={toggleColorMode}
            variant="ghost"
            size="sm"
            color={isDark ? 'dark.text.subtle' : 'text.subtle'}
            _hover={{
              bg: isDark ? 'dark.bg.tertiary' : 'gray.100',
            }}
          />

          <Menu>
            <MenuButton>
              <Flex alignItems="center" gap={3}>
                <Box textAlign="right">
                  <Text 
                    fontSize="sm" 
                    fontWeight="500" 
                    color={isDark ? 'dark.text.primary' : 'text.primary'}
                  >
                    Administrador
                  </Text>
                  <Text 
                    fontSize="xs" 
                    color={isDark ? 'dark.text.subtle' : 'text.subtle'}
                  >
                    admin@coopelos.com
                  </Text>
                </Box>
                <Avatar size="sm" name="Admin" bg="brand.500" />
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuItem>Meu Perfil</MenuItem>
              <MenuItem>Configurações</MenuItem>
              <MenuItem 
                color="danger.500" 
                onClick={handleLogout}
                icon={<HiArrowRightOnRectangle />}
              >
                Sair
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
}
