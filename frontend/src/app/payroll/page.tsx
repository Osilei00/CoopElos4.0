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
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react';
import { HiMagnifyingGlass, HiPlus, HiCurrencyDollar, HiDocumentText } from 'react-icons/hi2';
import { MainLayout } from '@/components';
import { usePayrolls } from '@/hooks';
import { useState } from 'react';
import Link from 'next/link';

export default function PayrollPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: payrolls, isLoading } = usePayrolls(selectedYear, selectedMonth);

  const filteredData = (payrolls || []).filter((item: any) => {
    const matchesSearch = !searchTerm || 
      item.cooperado?.nome_cooperado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cooperado?.cpf_cooperado?.includes(searchTerm);
    const matchesStatus = !statusFilter || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'green';
      case 'processing': return 'yellow';
      case 'draft': return 'gray';
      case 'closed': return 'blue';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'processing': return 'Processando';
      case 'draft': return 'Rascunho';
      case 'closed': return 'Fechado';
      default: return status;
    }
  };

  return (
    <MainLayout>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Box>
            <Heading size="lg">
              Folha de Pagamento
            </Heading>
            <Text mt={1}>
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
                      <Input 
                        placeholder="Buscar cooperado..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                    <Select 
                      maxW="200px" 
                      placeholder="Status"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="paid">Pago</option>
                      <option value="processing">Processando</option>
                      <option value="draft">Rascunho</option>
                      <option value="closed">Fechado</option>
                    </Select>
                    <Select 
                      maxW="200px" 
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    >
                      <option value={1}>Janeiro</option>
                      <option value={2}>Fevereiro</option>
                      <option value={3}>Março</option>
                      <option value={4}>Abril</option>
                      <option value={5}>Maio</option>
                      <option value={6}>Junho</option>
                      <option value={7}>Julho</option>
                      <option value={8}>Agosto</option>
                      <option value={9}>Setembro</option>
                      <option value={10}>Outubro</option>
                      <option value={11}>Novembro</option>
                      <option value={12}>Dezembro</option>
                    </Select>
                    <Select 
                      maxW="150px" 
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    >
                      <option value={2026}>2026</option>
                      <option value={2025}>2025</option>
                    </Select>
                  </HStack>

                  {isLoading ? (
                    <VStack spacing={4} align="stretch">
                      <Skeleton height="40px" />
                      <SkeletonText noOfLines={4} spacing={4} />
                    </VStack>
                  ) : (
                    <Box overflowX="auto">
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>Cooperado</Th>
                            <Th isNumeric>Salário Base</Th>
                            <Th isNumeric>Deduções</Th>
                            <Th isNumeric>Valor Líquido</Th>
                            <Th>Status</Th>
                            <Th>Ações</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {filteredData.length === 0 ? (
                            <Tr>
                              <Td colSpan={6} textAlign="center" py={8}>
                                Nenhum registro encontrado
                              </Td>
                            </Tr>
                          ) : (
                            filteredData.map((item: any) => (
                              <Tr key={item.id}>
                                <Td fontWeight="500">
                                  {item.cooperado?.nome_cooperado || '-'}
                                </Td>
                                <Td isNumeric fontWeight="500">
                                  R$ {(item.base_salary || 0).toLocaleString('pt-BR')}
                                </Td>
                                <Td isNumeric color="danger.500">
                                  - R$ {(item.deductions || 0).toLocaleString('pt-BR')}
                                </Td>
                                <Td isNumeric fontWeight="600" color="success.500">
                                  R$ {(item.net_value || 0).toLocaleString('pt-BR')}
                                </Td>
                                <Td>
                                  <Badge
                                    colorScheme={getStatusColor(item.status)}
                                    borderRadius="full"
                                  >
                                    {getStatusLabel(item.status)}
                                  </Badge>
                                </Td>
                                <Td>
                                  <Link href={`/payroll/${item.id}`}>
                                    <Button size="sm" variant="ghost" colorScheme="blue">
                                      Detalhes
                                    </Button>
                                  </Link>
                                </Td>
                              </Tr>
                            ))
                          )}
                        </Tbody>
                      </Table>
                    </Box>
                  )}
                </CardBody>
              </Card>
            </TabPanel>

            <TabPanel p={0}>
              <Card>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Box p={4} bg="blue.50" borderRadius="md" _dark={{ bg: 'blue.900' }}>
                      <Text fontWeight="600" color="blue.700" _dark={{ color: 'blue.200' }}>
                        Folha Hospitalar
                      </Text>
                      <Text fontSize="sm" color="blue.600" _dark={{ color: 'blue.300' }}>
                        Inclui valores de hora extra, adicional noturno e insalubridade
                      </Text>
                    </Box>
                    <Text>
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
                    <Box p={4} bg="green.50" borderRadius="md" _dark={{ bg: 'green.900' }}>
                      <Text fontWeight="600" color="green.700" _dark={{ color: 'green.200' }}>
                        Folha SAD
                      </Text>
                      <Text fontSize="sm" color="green.600" _dark={{ color: 'green.300' }}>
                        Pagamento por produção (paciente atendido)
                      </Text>
                    </Box>
                    <Text>
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
                    <Box p={4} bg="purple.50" borderRadius="md" _dark={{ bg: 'purple.900' }}>
                      <Text fontWeight="600" color="purple.700" _dark={{ color: 'purple.200' }}>
                        Benefícios
                      </Text>
                      <Text fontSize="sm" color="purple.600" _dark={{ color: 'purple.300' }}>
                        Vale refeição, vale transporte, plano de saúde, etc.
                      </Text>
                    </Box>
                    <Text>
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
