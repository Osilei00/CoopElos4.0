'use client';

import {
  Box,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
  VStack,
  Icon,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  Code,
} from '@chakra-ui/react';
import { HiMagnifyingGlass, HiShieldCheck, HiDocumentText, HiUserGroup } from 'react-icons/hi2';
import { MainLayout } from '@/components';
import { useSession } from '@/hooks';

const auditData = [
  { id: 1, user: 'Maria Santos', action: 'create', entity: 'collaborator', entityId: '123', details: 'Criou cadastro de João Silva', timestamp: '2026-06-03 14:30:00', ip: '192.168.1.100' },
  { id: 2, user: 'Pedro Costa', action: 'update', entity: 'payroll', entityId: '456', details: 'Atualizou folha de pagamento de Ana Oliveira', timestamp: '2026-06-03 14:25:00', ip: '192.168.1.101' },
  { id: 3, user: 'João Silva', action: 'delete', entity: 'task', entityId: '789', details: 'Removeu tarefa "Verificar documentação"', timestamp: '2026-06-03 14:20:00', ip: '192.168.1.102' },
  { id: 4, user: 'Maria Santos', action: 'login', entity: 'auth', entityId: '-', details: 'Login realizado com sucesso', timestamp: '2026-06-03 14:15:00', ip: '192.168.1.100' },
  { id: 5, user: 'Pedro Costa', action: 'export', entity: 'report', entityId: '-', details: 'Exportou relatório mensal de pontualidade', timestamp: '2026-06-03 14:10:00', ip: '192.168.1.101' },
];

export default function AuditPage() {
  const { data: session } = useSession();
  const isAdmin = session?.role === 'admin';
  return (
    <MainLayout>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Box>
            <Heading size="lg" color="text.primary">
              Auditoria
            </Heading>
            <Text color="text.secondary" mt={1}>
              Histórico de ações e alterações no sistema
            </Text>
          </Box>
           <HStack spacing={3}>
             {isAdmin && (
               <Button leftIcon={<HiDocumentText />} variant="outline">
                 Exportar Log
               </Button>
             )}
           </HStack>
        </Flex>

        <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={8}>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel color="text.subtle">Ações Hoje</StatLabel>
                  <StatNumber fontSize="2xl" color="brand.500">156</StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel color="text.subtle">Logins</StatLabel>
                  <StatNumber fontSize="2xl" color="success.500">24</StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel color="text.subtle">Alterações</StatLabel>
                  <StatNumber fontSize="2xl" color="orange.500">89</StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel color="text.subtle">Exclusões</StatLabel>
                  <StatNumber fontSize="2xl" color="danger.500">3</StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        <Card>
          <CardBody>
            <HStack spacing={4} mb={6}>
              <InputGroup maxW="300px">
                <InputLeftElement pointerEvents="none">
                        <Icon as={HiMagnifyingGlass} color="gray.400" />
                </InputLeftElement>
                <Input placeholder="Buscar na auditoria..." />
              </InputGroup>
              <Select maxW="200px" placeholder="Ação">
                <option value="create">Criar</option>
                <option value="update">Atualizar</option>
                <option value="delete">Excluir</option>
                <option value="login">Login</option>
                <option value="export">Exportar</option>
              </Select>
              <Select maxW="200px" placeholder="Entidade">
                <option value="collaborator">Colaborador</option>
                <option value="payroll">Pagamento</option>
                <option value="task">Tarefa</option>
                <option value="auth">Autenticação</option>
                <option value="report">Relatório</option>
              </Select>
              <Input maxW="200px" type="date" defaultValue="2026-06-03" />
            </HStack>

            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Usuário</Th>
                    <Th>Ação</Th>
                    <Th>Entidade</Th>
                    <Th>Detalhes</Th>
                    <Th>Data/Hora</Th>
                    <Th>IP</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {auditData.map((item) => (
                    <Tr key={item.id}>
                      <Td fontWeight="500">{item.user}</Td>
                      <Td>
                        <Badge
                          colorScheme={
                            item.action === 'create'
                              ? 'green'
                              : item.action === 'update'
                              ? 'blue'
                              : item.action === 'delete'
                              ? 'red'
                              : item.action === 'login'
                              ? 'purple'
                              : 'yellow'
                          }
                          borderRadius="full"
                        >
                          {item.action}
                        </Badge>
                      </Td>
                      <Td>
                        <Code fontSize="xs">{item.entity}</Code>
                      </Td>
                      <Td color="text.subtle" maxW="300px" isTruncated>
                        {item.details}
                      </Td>
                      <Td color="text.subtle" fontSize="sm">
                        {item.timestamp}
                      </Td>
                      <Td color="text.subtle" fontSize="sm">
                        {item.ip}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </CardBody>
        </Card>
      </Box>
    </MainLayout>
  );
}
