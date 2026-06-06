'use client';

import {
  Box,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  HStack,
  VStack,
  Icon,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Grid,
  GridItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  Badge,
  IconButton,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stat,
  StatLabel,
  StatNumber,
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react';
import { HiArrowLeft, HiCheck, HiPrinter, HiCurrencyDollar } from 'react-icons/hi2';
import { MainLayout } from '@/components';
import { ExportButton } from '@/components/ExportButton';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface PayrollDetail {
  id: string;
  collaborator: string;
  role: string;
  period: string;
  baseSalary: number;
  hoursWorked: number;
  overtimeHours: number;
  overtimeValue: number;
  nightShiftValue: number;
  hazardValue: number;
  otherBonuses: number;
  totalGross: number;
  inss: number;
  irrf: number;
  otherDeductions: number;
  totalDeductions: number;
  netValue: number;
  status: string;
  paymentDate: string;
}

const mockPayroll: PayrollDetail = {
  id: '1',
  collaborator: 'João Silva',
  role: 'Enfermeiro',
  period: 'Maio/2026',
  baseSalary: 5500,
  hoursWorked: 220,
  overtimeHours: 20,
  overtimeValue: 1250,
  nightShiftValue: 400,
  hazardValue: 200,
  otherBonuses: 0,
  totalGross: 7350,
  inss: 822.50,
  irrf: 740.50,
  otherDeductions: 0,
  totalDeductions: 1563,
  netValue: 5787,
  status: 'pago',
  paymentDate: '2026-05-30',
};

export default function PayrollDetailPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [payroll, setPayroll] = useState<PayrollDetail | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setPayroll(mockPayroll);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <Box>
          <HStack spacing={4} mb={6}>
            <Skeleton h="40px" w="40px" />
            <Box>
              <Skeleton h="32px" w="200px" mb={2} />
              <SkeletonText w="300px" />
            </Box>
          </HStack>
          <Card>
            <CardBody>
              <VStack spacing={4}>
                <Skeleton h="20px" w="100%" />
                <Skeleton h="20px" w="100%" />
                <Skeleton h="20px" w="100%" />
              </VStack>
            </CardBody>
          </Card>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <HStack spacing={4}>
            <Link href="/payroll">
              <IconButton
                aria-label="Voltar"
                icon={<HiArrowLeft />}
                variant="ghost"
              />
            </Link>
            <Box>
              <Heading size="lg" color="text.primary">
                Folha de Pagamento
              </Heading>
              <Text color="text.secondary" mt={1}>
                {payroll?.collaborator} - {payroll?.period}
              </Text>
            </Box>
            <Badge colorScheme={payroll?.status === 'pago' ? 'green' : 'yellow'}>
              {payroll?.status}
            </Badge>
          </HStack>
          <HStack spacing={3}>
            <Button leftIcon={<HiPrinter />} variant="outline">
              Imprimir
            </Button>
            <ExportButton type="payroll" id={params.id as string} />
            <Button leftIcon={<HiCurrencyDollar />} colorScheme="green">
              Confirmar Pagamento
            </Button>
          </HStack>
        </Flex>

        <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={8}>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel color="text.subtle">Salário Base</StatLabel>
                  <StatNumber fontSize="2xl" color="brand.500">
                    R$ {payroll?.baseSalary.toLocaleString('pt-BR')}
                  </StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel color="text.subtle">Total Bruto</StatLabel>
                  <StatNumber fontSize="2xl" color="success.500">
                    R$ {payroll?.totalGross.toLocaleString('pt-BR')}
                  </StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel color="text.subtle">Total Deduções</StatLabel>
                  <StatNumber fontSize="2xl" color="danger.500">
                    R$ {payroll?.totalDeductions.toLocaleString('pt-BR')}
                  </StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel color="text.subtle">Valor Líquido</StatLabel>
                  <StatNumber fontSize="2xl" color="purple.500">
                    R$ {payroll?.netValue.toLocaleString('pt-BR')}
                  </StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        <Card>
          <CardBody>
            <Tabs colorScheme="blue">
              <TabList mb={4}>
                <Tab>Proventos</Tab>
                <Tab>Deduções</Tab>
                <Tab>Resumo</Tab>
              </TabList>

              <TabPanels>
                <TabPanel p={0}>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Heading size="sm" mb={4} color="text.subtle">
                        Vencimentos
                      </Heading>
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>Descrição</Th>
                            <Th isNumeric>Horas</Th>
                            <Th isNumeric>Valor Unitário</Th>
                            <Th isNumeric>Total</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          <Tr>
                            <Td fontWeight="500">Salário Base</Td>
                            <Td isNumeric>{payroll?.hoursWorked}h</Td>
                            <Td isNumeric>R$ {(payroll?.baseSalary || 0) / (payroll?.hoursWorked || 1)}</Td>
                            <Td isNumeric fontWeight="600">
                              R$ {payroll?.baseSalary.toLocaleString('pt-BR')}
                            </Td>
                          </Tr>
                          <Tr>
                            <Td fontWeight="500" color="orange.500">Hora Extra (50%)</Td>
                            <Td isNumeric>{payroll?.overtimeHours}h</Td>
                            <Td isNumeric>R$ {((payroll?.baseSalary || 0) / (payroll?.hoursWorked || 1) * 1.5).toFixed(2)}</Td>
                            <Td isNumeric fontWeight="600" color="orange.500">
                              R$ {payroll?.overtimeValue.toLocaleString('pt-BR')}
                            </Td>
                          </Tr>
                          <Tr>
                            <Td fontWeight="500" color="purple.500">Adicional Noturno</Td>
                            <Td isNumeric>-</Td>
                            <Td isNumeric>-</Td>
                            <Td isNumeric fontWeight="600" color="purple.500">
                              R$ {payroll?.nightShiftValue.toLocaleString('pt-BR')}
                            </Td>
                          </Tr>
                          <Tr>
                            <Td fontWeight="500" color="red.500">Adicional Insalubridade</Td>
                            <Td isNumeric>-</Td>
                            <Td isNumeric>-</Td>
                            <Td isNumeric fontWeight="600" color="red.500">
                              R$ {payroll?.hazardValue.toLocaleString('pt-BR')}
                            </Td>
                          </Tr>
                          <Tr>
                            <Td fontWeight="700" colSpan={3}>Total Proventos</Td>
                            <Td isNumeric fontWeight="700" fontSize="lg">
                              R$ {payroll?.totalGross.toLocaleString('pt-BR')}
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </Box>
                  </VStack>
                </TabPanel>

                <TabPanel p={0}>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Heading size="sm" mb={4} color="text.subtle">
                        Deduções
                      </Heading>
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>Descrição</Th>
                            <Th isNumeric>Base</Th>
                            <Th isNumeric>Alíquota</Th>
                            <Th isNumeric>Valor</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          <Tr>
                            <Td fontWeight="500" color="danger.500">INSS</Td>
                            <Td isNumeric>R$ {payroll?.totalGross.toLocaleString('pt-BR')}</Td>
                            <Td isNumeric>11%</Td>
                            <Td isNumeric fontWeight="600" color="danger.500">
                              R$ {payroll?.inss.toLocaleString('pt-BR')}
                            </Td>
                          </Tr>
                          <Tr>
                            <Td fontWeight="500" color="danger.500">IRRF</Td>
                            <Td isNumeric>R$ {((payroll?.totalGross || 0) - (payroll?.inss || 0)).toLocaleString('pt-BR')}</Td>
                            <Td isNumeric>-</Td>
                            <Td isNumeric fontWeight="600" color="danger.500">
                              R$ {payroll?.irrf.toLocaleString('pt-BR')}
                            </Td>
                          </Tr>
                          <Tr>
                            <Td fontWeight="700" colSpan={3}>Total Deduções</Td>
                            <Td isNumeric fontWeight="700" fontSize="lg" color="danger.500">
                              R$ {payroll?.totalDeductions.toLocaleString('pt-BR')}
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </Box>
                  </VStack>
                </TabPanel>

                <TabPanel p={0}>
                  <VStack spacing={6} align="stretch">
                    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                      <Box>
                        <Heading size="sm" mb={4} color="text.subtle">
                          Resumo do Pagamento
                        </Heading>
                        <VStack spacing={3} align="stretch">
                          <Flex justifyContent="space-between">
                            <Text>Colaborador:</Text>
                            <Text fontWeight="500">{payroll?.collaborator}</Text>
                          </Flex>
                          <Flex justifyContent="space-between">
                            <Text>Cargo:</Text>
                            <Text fontWeight="500">{payroll?.role}</Text>
                          </Flex>
                          <Flex justifyContent="space-between">
                            <Text>Período:</Text>
                            <Text fontWeight="500">{payroll?.period}</Text>
                          </Flex>
                          <Flex justifyContent="space-between">
                            <Text>Status:</Text>
                            <Badge colorScheme={payroll?.status === 'pago' ? 'green' : 'yellow'}>
                              {payroll?.status}
                            </Badge>
                          </Flex>
                          <Flex justifyContent="space-between">
                            <Text>Data Pagamento:</Text>
                            <Text fontWeight="500">{payroll?.paymentDate}</Text>
                          </Flex>
                        </VStack>
                      </Box>

                      <Box>
                        <Heading size="sm" mb={4} color="text.subtle">
                          Valores
                        </Heading>
                        <VStack spacing={3} align="stretch">
                          <Flex justifyContent="space-between">
                            <Text>Total Bruto:</Text>
                            <Text fontWeight="500" color="success.500">
                              R$ {payroll?.totalGross.toLocaleString('pt-BR')}
                            </Text>
                          </Flex>
                          <Flex justifyContent="space-between">
                            <Text>Total Deduções:</Text>
                            <Text fontWeight="500" color="danger.500">
                              R$ {payroll?.totalDeductions.toLocaleString('pt-BR')}
                            </Text>
                          </Flex>
                          <Divider />
                          <Flex justifyContent="space-between">
                            <Text fontWeight="700" fontSize="lg">Valor Líquido:</Text>
                            <Text fontWeight="700" fontSize="lg" color="purple.500">
                              R$ {payroll?.netValue.toLocaleString('pt-BR')}
                            </Text>
                          </Flex>
                        </VStack>
                      </Box>
                    </Grid>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </Box>
    </MainLayout>
  );
}
