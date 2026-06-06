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
import { HiMagnifyingGlass, HiPlus, HiUserGroup, HiCurrencyDollar, HiArrowDownTray } from 'react-icons/hi2';
import { MainLayout } from '@/components';
import { ExportButton } from '@/components/ExportButton';

const sadData = [
  { id: '1', collaborator: 'João Silva', patients: 8, gross: 640, tax: 128, net: 512, period: '2026-05-01 a 2026-05-15' },
  { id: '2', collaborator: 'Maria Santos', patients: 12, gross: 960, tax: 192, net: 768, period: '2026-05-01 a 2026-05-15' },
  { id: '3', collaborator: 'Pedro Costa', patients: 6, gross: 480, tax: 96, net: 384, period: '2026-05-01 a 2026-05-15' },
  { id: '4', collaborator: 'Ana Oliveira', patients: 10, gross: 800, tax: 160, net: 640, period: '2026-05-01 a 2026-05-15' },
];

export default function TimesheetsSadPage() {
  return (
    <MainLayout>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Box>
            <Heading size="lg" color="text.primary">
              Ponto SAD
            </Heading>
            <Text color="text.secondary" mt={1}>
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

        <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={8}>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel color="text.subtle">Total Pacientes (Mês)</StatLabel>
                  <StatNumber fontSize="2xl" color="brand.500">312</StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel color="text.subtle">Receita Bruta</StatLabel>
                  <StatNumber fontSize="2xl" color="success.500">R$ 24.960</StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel color="text.subtle">Impostos (20%)</StatLabel>
                  <StatNumber fontSize="2xl" color="danger.500">R$ 4.992</StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel color="text.subtle">Receita Líquida</StatLabel>
                  <StatNumber fontSize="2xl" color="purple.500">R$ 19.968</StatNumber>
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
              <Select maxW="200px" placeholder="Período">
                <option value="2026-05-1">01/05 a 15/05/2026</option>
                <option value="2026-05-16">16/05 a 31/05/2026</option>
                <option value="2026-04">Abril 2026</option>
              </Select>
            </HStack>

            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Cooperado</Th>
                    <Th>Período</Th>
                    <Th isNumeric>Pacientes</Th>
                    <Th isNumeric>Valor Bruto</Th>
                    <Th isNumeric>Impostos (20%)</Th>
                    <Th isNumeric>Valor Líquido</Th>
                    <Th>Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {sadData.map((item) => (
                    <Tr key={item.id}>
                      <Td fontWeight="500">{item.collaborator}</Td>
                      <Td color="text.subtle">{item.period}</Td>
                      <Td isNumeric fontWeight="600" color="brand.500">
                        {item.patients}
                      </Td>
                      <Td isNumeric>R$ {item.gross.toLocaleString('pt-BR')}</Td>
                      <Td isNumeric color="danger.500">
                        - R$ {item.tax.toLocaleString('pt-BR')}
                      </Td>
                      <Td isNumeric fontWeight="600" color="success.500">
                        R$ {item.net.toLocaleString('pt-BR')}
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
