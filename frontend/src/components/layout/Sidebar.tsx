'use client';

import { Box, Flex, VStack, Icon, Text, Avatar, Divider } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HiHome,
  HiCurrencyDollar,
  HiClock,
  HiCalendar,
  HiClipboard,
  HiCog,
  HiShieldCheck,
  HiUserGroup,
  HiHeart,
  HiIdentification,
  HiBanknotes,
} from 'react-icons/hi2';
import { useColorMode } from '@/lib/color-mode';
import { useSession } from '@/hooks';

export const SIDEBAR_WIDTH = '64px';
export const SIDEBAR_EXPANDED_WIDTH = '220px';

interface NavItem {
  label: string;
  href: string;
  icon: any;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard',         href: '/dashboard',          icon: HiHome },
  { label: 'Usuários',          href: '/users',              icon: HiUserGroup,     adminOnly: true },
  { label: 'Cooperados',        href: '/cooperados',         icon: HiIdentification },
  { label: 'Folha de Pagamento',href: '/payroll',            icon: HiCurrencyDollar },
  { label: 'Ponto Hospitalar',  href: '/timesheets/hospital',icon: HiClock },
  { label: 'Ponto SAD',         href: '/timesheets/sad',     icon: HiClock },
  { label: 'Pacientes',         href: '/patients',           icon: HiHeart },
  { label: 'Férias',            href: '/vacations',          icon: HiCalendar },
  { label: 'Contribuições',     href: '/contribuicoes',      icon: HiBanknotes },
  { label: 'Tarefas',           href: '/tasks',              icon: HiClipboard },
  { label: 'Auditoria',         href: '/audit',              icon: HiShieldCheck },
  { label: 'Configurações',     href: '/settings',           icon: HiCog,           adminOnly: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { colorMode } = useColorMode();
  const { data: session } = useSession();
  const isDark = colorMode === 'dark';
  const isAdmin = session?.role === 'admin';

  const filteredNavItems = navItems.filter(
    (item) => !(item.adminOnly && !isAdmin)
  );

  const userName = session?.name || 'Usuário';
  const userEmail = session?.email || '';

  return (
    <Box
      role="group"
      w={SIDEBAR_WIDTH}
      _hover={{ w: SIDEBAR_EXPANDED_WIDTH, boxShadow: "lg" }}
      transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
      h="100vh"
      bg={isDark ? 'dark.bg.secondary' : 'white'}
      borderRight="1px solid"
      borderColor={isDark ? 'dark.border.light' : 'border.light'}
      position="fixed"
      left={0}
      top={0}
      display="flex"
      flexDirection="column"
      py={4}
      zIndex={100}
      overflowY="auto"
      overflowX="hidden"
    >
      {/* Logo */}
      <Flex alignItems="center" gap={3} px={4} mb={6}>
        <Avatar size="sm" name="CoopElos" bg="brand.500" flexShrink={0} />
        <Text
          fontSize="sm"
          fontWeight="700"
          color={isDark ? 'dark.text.primary' : 'text.primary'}
          letterSpacing="tight"
        >
          CoopElos
        </Text>
      </Flex>

      <Divider
        borderColor={isDark ? 'dark.border.light' : 'border.light'}
        mb={3}
      />

      {/* Navigation */}
      <VStack spacing={1} flex={1} alignItems="stretch" px={3}>
        {filteredNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Flex
              key={item.href}
              as={Link}
              href={item.href}
              alignItems="center"
              gap={3}
              px={3}
              py={2.5}
              borderRadius="8px"
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
                textDecoration: 'none',
              }}
              transition="all 0.15s"
            >
              <Icon as={item.icon} w={4} h={4} flexShrink={0} />
              <Text
                fontSize="sm"
                fontWeight={isActive ? '600' : '400'}
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {item.label}
              </Text>
            </Flex>
          );
        })}
      </VStack>

      <Divider
        borderColor={isDark ? 'dark.border.light' : 'border.light'}
        mt={3}
        mb={3}
      />

      {/* User info */}
      <Flex alignItems="center" gap={3} px={4}>
        <Avatar size="sm" name={userName} bg="brand.500" flexShrink={0} />
        <Box overflow="hidden">
          <Text
            fontSize="xs"
            fontWeight="600"
            color={isDark ? 'dark.text.primary' : 'text.primary'}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {userName}
          </Text>
          <Text
            fontSize="xs"
            color={isDark ? 'dark.text.subtle' : 'text.subtle'}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {userEmail}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
