'use client';

import {
  Box,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  Card,
  CardBody,
  Heading,
  Text,
  Flex,
  Icon,
  Skeleton,
  SkeletonText,
  VStack,
  HStack,
  Badge,
  Button,
} from '@chakra-ui/react';
import { 
  HiUsers, 
  HiCurrencyDollar, 
  HiClipboard, 
  HiCalendar,
  HiClock,
  HiArrowRight,
} from 'react-icons/hi2';
import { MainLayout } from '@/components';
import { useColorMode } from '@/lib/color-mode';
import { useRouter } from 'next/navigation';
import { useDashboardStats, useTasks, useAuditLogs, useSession } from '@/hooks';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDueDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Atrasada';
  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Amanhã';
  return `${diffDays} dias`;
}

const statusLabels: Record<string, string> = {
  pending: 'Pendente',
  in_progress: 'Em Andamento',
  completed: 'Concluída',
  overdue: 'Atrasada',
};

const statusColors: Record<string, string> = {
  pending: 'yellow',
  in_progress: 'blue',
  completed: 'green',
  overdue: 'red',
};

export default function DashboardPage() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const router = useRouter();
  const { data: session } = useSession();
  const { data: stats, isLoading } = useDashboardStats();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: auditLogs, isLoading: auditLoading } = useAuditLogs();

  const pendingTasks = tasks?.filter((task: any) => task.status !== 'completed').slice(0, 5) || [];
  const recentAuditLogs = auditLogs?.slice(0, 5) || [];

  const statCards = [
    {
      label: 'Cooperados Ativos',
      value: stats?.activeCooperados ?? 0,
      icon: HiUsers,
      color: 'brand.500',
      href: '/cooperados',
    },
    {
      label: 'Folha de Pagamento',
      value: formatCurrency(stats?.currentPayrollTotal ?? 0),
      icon: HiCurrencyDollar,
      color: 'success.500',
      href: '/payroll',
    },
    {
      label: 'Tarefas Pendentes',
      value: stats?.pendingTasks ?? 0,
      icon: HiClipboard,
      color: 'orange.500',
      href: '/tasks',
    },
    {
      label: 'Férias Programadas',
      value: stats?.scheduledVacations ?? 0,
      icon: HiCalendar,
      color: 'purple.500',
      href: '/vacations',
    },
  ];

  return (
    <MainLayout>
      <Box>
        <Heading 
          size="lg" 
          mb={2} 
          color={isDark ? 'dark.text.primary' : 'text.primary'}
        >
          Bem-vindo, {session?.name || 'Usuário'}
        </Heading>
        <Text 
          mb={8} 
          color={isDark ? 'dark.text.secondary' : 'text.secondary'}
        >
          Plataforma de gestão de RH e DP para cooperativas hospitalares
        </Text>

        <Grid templateColumns="repeat(4, 1fr)" gap={6}>
          {statCards.map((stat) => (
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
                      {isLoading ? (
                        <Skeleton height="32px" mt={2} />
                      ) : (
                        <StatNumber 
                          fontSize="2xl" 
                          fontWeight="600" 
                          mt={2}
                          color={isDark ? 'dark.text.primary' : 'text.primary'}
                        >
                          {stat.value}
                        </StatNumber>
                      )}
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
                <Flex justifyContent="space-between" alignItems="center" mb={4}>
                  <Heading 
                    size="md"
                    color={isDark ? 'dark.text.primary' : 'text.primary'}
                  >
                    Atividade Recente
                  </Heading>
                  <Button
                    variant="ghost"
                    size="sm"
                    rightIcon={<HiArrowRight />}
                    onClick={() => router.push('/audit')}
                  >
                    Ver todas
                  </Button>
                </Flex>
                {auditLoading ? (
                  <VStack spacing={4} align="stretch">
                    <Skeleton height="40px" />
                    <Skeleton height="40px" />
                    <Skeleton height="40px" />
                  </VStack>
                ) : recentAuditLogs.length === 0 ? (
                  <Text color={isDark ? 'dark.text.subtle' : 'text.subtle'}>
                    Nenhuma atividade recente
                  </Text>
                ) : (
                  <VStack spacing={3} align="stretch">
                    {recentAuditLogs.map((log: any) => (
                      <HStack 
                        key={log.id} 
                        p={3} 
                        bg={isDark ? 'dark.bg.tertiary' : 'gray.50'} 
                        borderRadius="8px"
                        justifyContent="space-between"
                      >
                        <VStack align="flex-start" spacing={1}>
                          <Text fontSize="sm" fontWeight="500">
                            {log.action} em {log.table_name}
                          </Text>
                          <Text fontSize="xs" color="text.subtle">
                            {log.user?.name || 'Sistema'} • {formatDate(log.created_at)}
                          </Text>
                        </VStack>
                      </HStack>
                    ))}
                  </VStack>
                )}
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Flex justifyContent="space-between" alignItems="center" mb={4}>
                  <Heading 
                    size="md"
                    color={isDark ? 'dark.text.primary' : 'text.primary'}
                  >
                    Próximas Tarefas
                  </Heading>
                  <Button
                    variant="ghost"
                    size="sm"
                    rightIcon={<HiArrowRight />}
                    onClick={() => router.push('/tasks')}
                  >
                    Ver todas
                  </Button>
                </Flex>
                {tasksLoading ? (
                  <VStack spacing={4} align="stretch">
                    <Skeleton height="40px" />
                    <Skeleton height="40px" />
                    <Skeleton height="40px" />
                  </VStack>
                ) : pendingTasks.length === 0 ? (
                  <Text color={isDark ? 'dark.text.subtle' : 'text.subtle'}>
                    Nenhuma tarefa pendente
                  </Text>
                ) : (
                  <VStack spacing={3} align="stretch">
                    {pendingTasks.map((task: any) => (
                      <HStack 
                        key={task.id} 
                        p={3} 
                        bg={isDark ? 'dark.bg.tertiary' : 'gray.50'} 
                        borderRadius="8px"
                        justifyContent="space-between"
                        cursor="pointer"
                        onClick={() => router.push('/tasks')}
                        _hover={{ bg: isDark ? 'dark.bg.elevated' : 'gray.100' }}
                      >
                        <VStack align="flex-start" spacing={1}>
                          <Text fontSize="sm" fontWeight="500">
                            {task.title}
                          </Text>
                          {task.due_date && (
                            <HStack spacing={2}>
                              <Icon as={HiClock} w={3} h={3} color="text.subtle" />
                              <Text fontSize="xs" color="text.subtle">
                                {formatDueDate(task.due_date)}
                              </Text>
                            </HStack>
                          )}
                        </VStack>
                        <Badge colorScheme={statusColors[task.status]}>
                          {statusLabels[task.status]}
                        </Badge>
                      </HStack>
                    ))}
                  </VStack>
                )}
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Box>
    </MainLayout>
  );
}
