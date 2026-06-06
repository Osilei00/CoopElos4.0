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
  Checkbox,
  IconButton,
} from '@chakra-ui/react';
import { HiMagnifyingGlass, HiPlus, HiClipboard, HiCheckCircle, HiClock, HiExclamationCircle } from 'react-icons/hi2';
import { MainLayout } from '@/components';

const tasksData = [
  { id: 1, title: 'Atualizar cadastro de João Silva', type: 'dp', priority: 'alta', dueDate: '2026-06-05', status: 'pendente', assignee: 'Maria Santos' },
  { id: 2, title: 'Verificar documentação de Ana Oliveira', type: 'document', priority: 'média', dueDate: '2026-06-10', status: 'em_andamento', assignee: 'Pedro Costa' },
  { id: 3, title: 'Processar folha de pagamento Maio', type: 'payroll', priority: 'alta', dueDate: '2026-06-08', status: 'pendente', assignee: 'João Silva' },
  { id: 4, title: 'Aprovar solicitação de férias', type: 'hr', priority: 'baixa', dueDate: '2026-06-15', status: 'concluida', assignee: 'Maria Santos' },
  { id: 5, title: 'Enviar relatório mensal', type: 'report', priority: 'média', dueDate: '2026-06-20', status: 'pendente', assignee: 'Pedro Costa' },
];

export default function TasksPage() {
  return (
    <MainLayout>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Box>
            <Heading size="lg" color="text.primary">
              Tarefas
            </Heading>
            <Text color="text.secondary" mt={1}>
              Gestão de tarefas e atividades do DP
            </Text>
          </Box>
          <HStack spacing={3}>
            <Button leftIcon={<HiClipboard />} variant="outline">
              Exportar
            </Button>
            <Button leftIcon={<HiPlus />} colorScheme="blue">
              Nova Tarefa
            </Button>
          </HStack>
        </Flex>

        <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={8}>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel color="text.subtle">Total Tarefas</StatLabel>
                  <StatNumber fontSize="2xl" color="brand.500">24</StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel color="text.subtle">Pendentes</StatLabel>
                  <StatNumber fontSize="2xl" color="orange.500">12</StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel color="text.subtle">Em Andamento</StatLabel>
                  <StatNumber fontSize="2xl" color="blue.500">8</StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel color="text.subtle">Concluídas</StatLabel>
                  <StatNumber fontSize="2xl" color="success.500">4</StatNumber>
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
                <Input placeholder="Buscar tarefa..." />
              </InputGroup>
              <Select maxW="200px" placeholder="Tipo">
                <option value="dp">DP</option>
                <option value="document">Documento</option>
                <option value="payroll">Pagamento</option>
                <option value="hr">RH</option>
                <option value="report">Relatório</option>
              </Select>
              <Select maxW="200px" placeholder="Prioridade">
                <option value="alta">Alta</option>
                <option value="média">Média</option>
                <option value="baixa">Baixa</option>
              </Select>
            </HStack>

            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th width="40px"></Th>
                    <Th>Tarefa</Th>
                    <Th>Tipo</Th>
                    <Th>Prioridade</Th>
                    <Th>Prazo</Th>
                    <Th>Responsável</Th>
                    <Th>Status</Th>
                    <Th>Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {tasksData.map((item) => (
                    <Tr key={item.id}>
                      <Td>
                        <Checkbox
                          isChecked={item.status === 'concluida'}
                          colorScheme="green"
                        />
                      </Td>
                      <Td fontWeight="500">{item.title}</Td>
                      <Td>
                        <Badge colorScheme="blue" borderRadius="full">
                          {item.type}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={
                            item.priority === 'alta'
                              ? 'red'
                              : item.priority === 'média'
                              ? 'yellow'
                              : 'green'
                          }
                          borderRadius="full"
                        >
                          {item.priority}
                        </Badge>
                      </Td>
                      <Td color="text.subtle">{item.dueDate}</Td>
                      <Td>{item.assignee}</Td>
                      <Td>
                        <Badge
                          colorScheme={
                            item.status === 'concluida'
                              ? 'green'
                              : item.status === 'em_andamento'
                              ? 'blue'
                              : 'yellow'
                          }
                          borderRadius="full"
                        >
                          {item.status.replace('_', ' ')}
                        </Badge>
                      </Td>
                      <Td>
                        <Button size="sm" variant="ghost" colorScheme="blue">
                          Editar
                        </Button>
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
