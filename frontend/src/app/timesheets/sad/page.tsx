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
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react';
import { HiMagnifyingGlass, HiPlus, HiUserGroup, HiCurrencyDollar, HiArrowDownTray } from 'react-icons/hi2';
import { MainLayout } from '@/components';
import { ExportButton } from '@/components/ExportButton';
import { useTimesheetsSad } from '@/hooks';
import { useState } from 'react';

export default function TimesheetsSadPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: timesheets, isLoading } = useTimesheetsSad(selectedYear, selectedMonth);

  const filteredData = (timesheets || []).filter((item: any) => {
    return !searchTerm || 
      item.cooperado?.nome_cooperado?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <MainLayout>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Box>
            <Heading size="lg">
              Ponto SAD
            </Heading>
            <Text mt={1}>
              Controle de produtividade por paciente atendido
            </Text>
          </Box>
          <HStack spacing={3}>
            <Button leftIcon={<HiCurrencyDollar />} variant="outline">
              Calcular Folha
            </Button>
            <Button leftIcon={<HiPlus />} colorScheme="blue">
              Registrar Atendimento
            </Button>
          </HStack>
        </Flex>

        <Card mb={6}>
          <CardBody>
            <HStack spacing={4}>
              <Select 
                maxW="150px" 
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
          </CardBody>
        </Card>

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
                      <Th isNumeric>Pacientes</Th>
                      <Th isNumeric>Valor Bruto</Th>
                      <Th isNumeric>Impostos (20%)</Th>
                      <Th isNumeric>Valor Líquido</Th>
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
                          <Td isNumeric fontWeight="600" color="brand.500">
                            {item.patient_count || 0}
                          </Td>
                          <Td isNumeric>
                            R$ {(item.gross_value || 0).toLocaleString('pt-BR')}
                          </Td>
                          <Td isNumeric color="danger.500">
                            - R$ {(item.tax_value || 0).toLocaleString('pt-BR')}
                          </Td>
                          <Td isNumeric fontWeight="600" color="success.500">
                            R$ {(item.net_value || 0).toLocaleString('pt-BR')}
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <ExportButton
                                type="timesheet_sad"
                                id={item.id}
                                label="PDF"
                              />
                              <Button size="sm" variant="ghost" colorScheme="blue">
                                Detalhes
                              </Button>
                            </HStack>
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
      </Box>
    </MainLayout>
  );
}
