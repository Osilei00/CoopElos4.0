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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { HiMagnifyingGlass, HiPlus, HiCurrencyDollar, HiDocumentText } from 'react-icons/hi2';
import { MainLayout } from '@/components';
import { usePayrolls } from '@/hooks';

const payrollData = [
  { id: 1, collaborator: 'João Silva', role: 'Enfermeiro', baseSalary: 5500, deductions: 1200, total: 4300, status: 'pago', period: '2026-05' },
  { id: 2, collaborator: 'Maria Santos', role: 'Técnica de Enfermagem', baseSalary: 4200, deductions: 950, total: 3250, status: 'pago', period: '2026-05' },
  { id: 3, collaborator: 'Pedro Costa', role: 'Auxiliar de Enfermagem', baseSalary: 3200, deductions: 750, total: 2450, status: 'pendente', period: '2026-05' },
  { id: 4, collaborator: 'Ana Oliveira', role: 'Enfermeira', baseSalary: 5800, deductions: 1250, total: 4550, status: 'pendente', period: '2026-05' },
];

export default function PayrollPage() {
  return (
    <MainLayout>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Box>
            <Heading size="lg" color="text.primary">
              Folha de Pagamento
            </Heading>
            <Text color="text.secondary" mt={1}>
              Gestão de folha de pagamento dos cooperados
            </Text>
          </Box>
          <HStack spacing={3}>
            <Button leftIcon={<HiDocumentText />} variant="outline">
              Exportar
            </Button>
            <Button leftIcon={<HiPlus />} colorScheme="blue">
              Adicionar Verba
            </Button>
          </HStack>
        </Flex>

        <Tabs colorScheme="blue">
          <TabList mb={4}>
            <Tab>Visão Geral</Tab>
            <Tab>Hospital</Tab>
            <Tab>SAD</Tab>
            <Tab>Benefícios</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0}>
              <Card>
                <CardBody>
                  <HStack spacing={4} mb={6}>
                    <InputGroup maxW="300px">
                      <InputLeftElement pointerEvents="none">
                        <Icon as={HiMagnifyingGlass} color="gray.400" />
                      </InputLeftElement>
                      <Input placeholder="Buscar cooperado..." />
                    </InputGroup>
                    <Select maxW="200px" placeholder="Status">
                      <option value="pago">Pago</option>
                      <option value="pendente">Pendente</option>
                      <option value="processando">Processando</option>
                    </Select>
                    <Select maxW="200px" placeholder="Período">
                      <option value="2026-05">Maio 2026</option>
                      <option value="2026-04">Abril 2026</option>
                      <option value="2026-03">Março 2026</option>
                    </Select>
                  </HStack>

                  <Box overflowX="auto">
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Cooperado</Th>
                          <Th>Cargo</Th>
                          <Th isNumeric>Salário Base</Th>
                          <Th isNumeric>Deduções</Th>
                          <Th isNumeric>Valor Líquido</Th>
                          <Th>Status</Th>
                          <Th>Ações</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {payrollData.map((item) => (
                          <Tr key={item.id}>
                            <Td fontWeight="500">{item.collaborator}</Td>
                            <Td>{item.role}</Td>
                            <Td isNumeric fontWeight="500">
                              R$ {item.baseSalary.toLocaleString('pt-BR')}
                            </Td>
                            <Td isNumeric color="danger.500">
                              - R$ {item.deductions.toLocaleString('pt-BR')}
                            </Td>
                            <Td isNumeric fontWeight="600" color="success.500">
                              R$ {item.total.toLocaleString('pt-BR')}
                            </Td>
                            <Td>
                              <Badge
                                colorScheme={item.status === 'pago' ? 'green' : 'yellow'}
                                borderRadius="full"
                              >
                                {item.status}
                              </Badge>
                            </Td>
                            <Td>
                              <Button size="sm" variant="ghost" colorScheme="blue">
                                Detalhes
                              </Button>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </CardBody>
              </Card>
            </TabPanel>

            <TabPanel p={0}>
              <Card>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Box p={4} bg="blue.50" borderRadius="md">
                      <Text fontWeight="600" color="blue.700">
                        Folha Hospitalar
                      </Text>
                      <Text fontSize="sm" color="blue.600">
                        Inclui valores de hora extra, adicional noturno e insalubridade
                      </Text>
                    </Box>
                    <Text color="text.subtle">
                      Selecione "Visão Geral" para ver todos os cooperados ou filtre por tipo de pagamento.
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>

            <TabPanel p={0}>
              <Card>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Box p={4} bg="green.50" borderRadius="md">
                      <Text fontWeight="600" color="green.700">
                        Folha SAD
                      </Text>
                      <Text fontSize="sm" color="green.600">
                        Pagamento por produção (paciente atendido)
                      </Text>
                    </Box>
                    <Text color="text.subtle">
                      Selecione "Visão Geral" para ver todos os cooperados ou filtre por tipo de pagamento.
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>

            <TabPanel p={0}>
              <Card>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Box p={4} bg="purple.50" borderRadius="md">
                      <Text fontWeight="600" color="purple.700">
                        Benefícios
                      </Text>
                      <Text fontSize="sm" color="purple.600">
                        Vale refeição, vale transporte, plano de saúde, etc.
                      </Text>
                    </Box>
                    <Text color="text.subtle">
                      Selecione "Visão Geral" para ver todos os cooperados ou filtre por tipo de pagamento.
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </MainLayout>
  );
}
