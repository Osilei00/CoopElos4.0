'use client';

import { Box, Flex, VStack, Icon, Text, Avatar } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HiHome,
  HiUsers,
  HiCurrencyDollar,
  HiClock,
  HiCalendar,
  HiClipboard,
  HiCog,
  HiShieldCheck,
  HiUserGroup,
  HiHeart,
  HiIdentification,
} from 'react-icons/hi2';
import { useColorMode } from '@/lib/color-mode';
import { useSession } from '@/hooks';

interface NavItem {
  label: string;
  href: string;
  icon: any;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: HiHome },
  { label: 'Colaboradores', href: '/collaborators', icon: HiUsers, adminOnly: true },
  { label: 'Cooperados', href: '/cooperados', icon: HiIdentification },
  { label: 'Folha de Pagamento', href: '/payroll', icon: HiCurrencyDollar },
  { label: 'Ponto Hospitalar', href: '/timesheets/hospital', icon: HiClock },
  { label: 'Ponto SAD', href: '/timesheets/sad', icon: HiClock },
  { label: 'Pacientes', href: '/patients', icon: HiHeart },
  { label: 'Férias', href: '/vacations', icon: HiCalendar },
  { label: 'Tarefas', href: '/tasks', icon: HiClipboard },
  { label: 'Auditoria', href: '/audit', icon: HiShieldCheck },
  { label: 'Usuários', href: '/users', icon: HiUserGroup, adminOnly: true },
  { label: 'Configurações', href: '/settings', icon: HiCog },
];

export function Sidebar() {
  const pathname = usePathname();
  const { colorMode } = useColorMode();
  const { data: session } = useSession();
  const isDark = colorMode === 'dark';

  const isAdmin = session?.role === 'admin';

  const filteredNavItems = navItems.filter((item) => {
    if (item.adminOnly && !isAdmin) {
      return false;
    }
    return true;
  });

  return (
    <Box
      w="64px"
      h="100vh"
      bg={isDark ? 'dark.bg.secondary' : 'white'}
      borderRight="1px solid"
      borderColor={isDark ? 'dark.border.light' : 'border.light'}
      position="fixed"
      left={0}
      top={0}
      display="flex"
      flexDirection="column"
      alignItems="center"
      py={4}
      zIndex={10}
    >
      {/* Logo */}
      <Box mb={8}>
        <Avatar size="sm" name="CoopElos" bg="brand.500" />
      </Box>

      {/* Navigation */}
      <VStack spacing={2} flex={1}>
        {filteredNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}>
              <Flex
                w="44px"
                h="44px"
                borderRadius="8px"
                alignItems="center"
                justifyContent="center"
                bg={isActive 
                  ? (isDark ? 'brand.900' : 'brand.50') 
                  : 'transparent'
                }
                color={isActive 
                  ? (isDark ? 'brand.400' : 'brand.500') 
                  : (isDark ? 'dark.text.subtle' : 'text.subtle')
                }
                _hover={{
                  bg: isDark ? 'brand.900' : 'brand.50',
                  color: isDark ? 'brand.400' : 'brand.500',
                }}
                transition="all 0.2s"
              >
                <Icon as={item.icon} w={5} h={5} />
              </Flex>
            </Link>
          );
        })}
      </VStack>

      {/* User */}
      <Box>
        <Avatar size="sm" name="User" />
      </Box>
    </Box>
  );
}
