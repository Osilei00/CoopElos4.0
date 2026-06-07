'use client';

import {
  Box,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardBody,
  Heading,
  Text,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { HiUsers, HiCurrencyDollar, HiClipboard, HiCalendar } from 'react-icons/hi2';
import { MainLayout } from '@/components';
import { useColorMode } from '@/lib/color-mode';
import { useRouter } from 'next/navigation';

const stats = [
  {
    label: 'Colaboradores Ativos',
    value: '47',
    change: '+3',
    trend: 'up',
    icon: HiUsers,
    color: 'brand.500',
    href: '/cooperados',
  },
  {
    label: 'Folha de Pagamento',
    value: 'R$ 89.500',
    change: '+5.2%',
    trend: 'up',
    icon: HiCurrencyDollar,
    color: 'success.500',
    href: '/payroll',
  },
  {
    label: 'Tarefas Pendentes',
    value: '12',
    change: '-4',
    trend: 'down',
    icon: HiClipboard,
    color: 'orange.500',
    href: '/tasks',
  },
  {
    label: 'Férias Programadas',
    value: '5',
    change: '+2',
    trend: 'up',
    icon: HiCalendar,
    color: 'purple.500',
    href: '/vacations',
  },
];

export default function DashboardPage() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const router = useRouter();

  return (
    <MainLayout>
      <Box>
        <Heading 
          size="lg" 
          mb={6} 
          color={isDark ? 'dark.text.primary' : 'text.primary'}
        >
          Bem-vindo ao CoopElos
        </Heading>
        <Text 
          mb={8} 
          color={isDark ? 'dark.text.secondary' : 'text.secondary'}
        >
          Plataforma de gestão de RH e DP para cooperativas hospitalares
        </Text>

        <Grid templateColumns="repeat(4, 1fr)" gap={6}>
          {stats.map((stat) => (
            <GridItem key={stat.label}>
              <Card
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'md',
                }}
                onClick={() => router.push(stat.href)}
              >
                <CardBody>
                  <Flex justifyContent="space-between" alignItems="flex-start">
                    <Stat>
                      <StatLabel 
                        color={isDark ? 'dark.text.subtle' : 'text.subtle'} 
                        fontSize="sm"
                      >
                        {stat.label}
                      </StatLabel>
                      <StatNumber 
                        fontSize="2xl" 
                        fontWeight="600" 
                        mt={2}
                        color={isDark ? 'dark.text.primary' : 'text.primary'}
                      >
                        {stat.value}
                      </StatNumber>
                      <StatHelpText mb={0}>
                        <StatArrow
                          type={stat.trend as 'increase' | 'decrease'}
                          color={stat.trend === 'up' ? 'success.500' : 'danger.500'}
                        />
                        <Text
                          as="span"
                          color={stat.trend === 'up' ? 'success.500' : 'danger.500'}
                        >
                          {stat.change}
                        </Text>
                      </StatHelpText>
                    </Stat>
                    <Box
                      p={3}
                      borderRadius="8px"
                      bg={isDark ? 'dark.bg.tertiary' : `${stat.color}10`}
                      color={stat.color}
                    >
                      <Icon as={stat.icon} w={6} h={6} />
                    </Box>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
          ))}
        </Grid>

        <Grid templateColumns="2fr 1fr" gap={6} mt={8}>
          <GridItem>
            <Card>
              <CardBody>
                <Heading 
                  size="md" 
                  mb={4}
                  color={isDark ? 'dark.text.primary' : 'text.primary'}
                >
                  Atividade Recente
                </Heading>
                <Text color={isDark ? 'dark.text.subtle' : 'text.subtle'}>
                  Nenhuma atividade recente
                </Text>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Heading 
                  size="md" 
                  mb={4}
                  color={isDark ? 'dark.text.primary' : 'text.primary'}
                >
                  Próximas Tarefas
                </Heading>
                <Text color={isDark ? 'dark.text.subtle' : 'text.subtle'}>
                  Nenhuma tarefa pendente
                </Text>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Box>
    </MainLayout>
  );
}
