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
} from '@chakra-ui/react';
import { HiMagnifyingGlass, HiPlus, HiClock, HiCalendarDays, HiArrowDownTray } from 'react-icons/hi2';
import { MainLayout } from '@/components';
import { ExportButton } from '@/components/ExportButton';

const hospitalData = [
  { id: '1', collaborator: 'João Silva', code: 'M', hours: 6, date: '2026-05-01', extra: 0, total: 6 },
  { id: '2', collaborator: 'João Silva', code: 'T', hours: 6, date: '2026-05-02', extra: 0, total: 6 },
  { id: '3', collaborator: 'Maria Santos', code: 'SN', hours: 12, date: '2026-05-01', extra: 4, total: 16 },
  { id: '4', collaborator: 'Pedro Costa', code: 'D', hours: 8, date: '2026-05-01', extra: 0, total: 8 },
  { id: '5', collaborator: 'Ana Oliveira', code: 'M', hours: 6, date: '2026-05-01', extra: 2, total: 8 },
];

export default function TimesheetsHospitalPage() {
  return (
    <MainLayout>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Box>
            <Heading size="lg" color="text.primary">
              Ponto Hospitalar
            </Heading>
            <Text color="text.secondary" mt={1}>
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

        <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={8}>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel color="text.subtle">Total Horas (Mês)</StatLabel>
                  <StatNumber fontSize="2xl" color="brand.500">1.280h</StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel color="text.subtle">Horas Extras</StatLabel>
                  <StatNumber fontSize="2xl" color="orange.500">120h</StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel color="text.subtle">Cooperados Ativos</StatLabel>
                  <StatNumber fontSize="2xl" color="success.500">24</StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel color="text.subtle">Média Diária</StatLabel>
                  <StatNumber fontSize="2xl" color="purple.500">7.2h</StatNumber>
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
                <Input placeholder="Buscar cooperado..." />
              </InputGroup>
              <Select maxW="200px" placeholder="Código">
                <option value="M">M (6h)</option>
                <option value="T">T (6h)</option>
                <option value="SN">SN (12h)</option>
                <option value="D">D (8h)</option>
                <option value="F">F (Folga)</option>
              </Select>
              <Input maxW="200px" type="date" defaultValue="2026-05-01" />
            </HStack>

            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Cooperado</Th>
                    <Th>Data</Th>
                    <Th>Código</Th>
                    <Th isNumeric>Horas Base</Th>
                    <Th isNumeric>Horas Extras</Th>
                    <Th isNumeric>Total</Th>
                    <Th>Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {hospitalData.map((item) => (
                    <Tr key={item.id}>
                      <Td fontWeight="500">{item.collaborator}</Td>
                      <Td>{item.date}</Td>
                      <Td>
                        <Badge colorScheme="blue" borderRadius="full">
                          {item.code}
                        </Badge>
                      </Td>
                      <Td isNumeric>{item.hours}h</Td>
                      <Td isNumeric color={item.extra > 0 ? 'orange.500' : 'text.subtle'}>
                        {item.extra > 0 ? `+${item.extra}h` : '-'}
                      </Td>
                      <Td isNumeric fontWeight="600">{item.total}h</Td>
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
