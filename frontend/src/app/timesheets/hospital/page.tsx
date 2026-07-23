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
import { HiMagnifyingGlass, HiPlus, HiClock, HiCalendarDays, HiArrowDownTray } from 'react-icons/hi2';
import { MainLayout } from '@/components';
import { ExportButton } from '@/components/ExportButton';
import { useTimesheetsHospital } from '@/hooks';
import { useState } from 'react';

export default function TimesheetsHospitalPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [searchTerm, setSearchTerm] = useState('');
  const [codeFilter, setCodeFilter] = useState('');

  const { data: timesheets, isLoading } = useTimesheetsHospital(selectedYear, selectedMonth);

  const filteredData = (timesheets || []).filter((item: any) => {
    const matchesSearch = !searchTerm || 
      item.cooperado?.nome_cooperado?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCode = !codeFilter || item.shift_code === codeFilter;
    return matchesSearch && matchesCode;
  });

  const getCodeLabel = (code: string) => {
    switch (code) {
      case 'M': return 'Manhã (6h)';
      case 'T': return 'Tarde (6h)';
      case 'SN': return 'Standard Noite (12h)';
      case 'D': return 'Diurno (8h)';
      case 'F': return 'Folga';
      default: return code;
    }
  };

  return (
    <MainLayout>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Box>
            <Heading size="lg">
              Ponto Hospitalar
            </Heading>
            <Text mt={1}>
              Controle de jornada dos cooperados no regime hospitalar
            </Text>
          </Box>
          <HStack spacing={3}>
            <Button leftIcon={<HiCalendarDays />} variant="outline">
              Calendário
            </Button>
            <Button leftIcon={<HiPlus />} colorScheme="blue">
              Registrar Ponto
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
              <Select 
                maxW="200px" 
                placeholder="Turno"
                value={codeFilter}
                onChange={(e) => setCodeFilter(e.target.value)}
              >
                <option value="M">Manhã (6h)</option>
                <option value="T">Tarde (6h)</option>
                <option value="SN">Standard Noite (12h)</option>
                <option value="D">Diurno (8h)</option>
                <option value="F">Folga</option>
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
                      <Th>Data</Th>
                      <Th>Turno</Th>
                      <Th isNumeric>Horas Base</Th>
                      <Th isNumeric>Horas Extras</Th>
                      <Th isNumeric>Total</Th>
                      <Th>Ações</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredData.length === 0 ? (
                      <Tr>
                        <Td colSpan={7} textAlign="center" py={8}>
                          Nenhum registro encontrado
                        </Td>
                      </Tr>
                    ) : (
                      filteredData.map((item: any) => (
                        <Tr key={item.id}>
                          <Td fontWeight="500">
                            {item.cooperado?.nome_cooperado || '-'}
                          </Td>
                          <Td>{item.date || '-'}</Td>
                          <Td>
                            <Badge colorScheme="blue" borderRadius="full">
                              {getCodeLabel(item.shift_code)}
                            </Badge>
                          </Td>
                          <Td isNumeric>{item.base_hours || 0}h</Td>
                          <Td isNumeric color={(item.overtime_hours || 0) > 0 ? 'orange.500' : undefined}>
                            {(item.overtime_hours || 0) > 0 ? `+${item.overtime_hours}h` : '-'}
                          </Td>
                          <Td isNumeric fontWeight="600">{item.total_hours || 0}h</Td>
                          <Td>
                            <HStack spacing={2}>
                              <ExportButton
                                type="timesheet_hospital"
                                id={item.id}
                                label="PDF"
                              />
                              <Button size="sm" variant="ghost" colorScheme="blue">
                                Editar
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
