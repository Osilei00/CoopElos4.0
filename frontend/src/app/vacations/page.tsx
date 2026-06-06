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
  Progress,
} from '@chakra-ui/react';
import { HiMagnifyingGlass, HiPlus, HiCalendar, HiClock } from 'react-icons/hi2';
import { MainLayout } from '@/components';

const vacationData = [
  { id: 1, collaborator: 'João Silva', daysUsed: 15, daysTotal: 30, start: '2026-06-01', end: '2026-06-15', status: 'aprovado' },
  { id: 2, collaborator: 'Maria Santos', daysUsed: 10, daysTotal: 30, start: '2026-07-01', end: '2026-07-10', status: 'pendente' },
  { id: 3, collaborator: 'Pedro Costa', daysUsed: 0, daysTotal: 30, start: '', end: '', status: 'aguardando' },
  { id: 4, collaborator: 'Ana Oliveira', daysUsed: 20, daysTotal: 30, start: '2026-05-01', end: '2026-05-20', status: 'aprovado' },
];

export default function VacationsPage() {
  return (
    <MainLayout>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Box>
            <Heading size="lg" color="text.primary">
              Férias
            </Heading>
            <Text color="text.secondary" mt={1}>
              Gestão de férias dos cooperados
            </Text>
          </Box>
          <HStack spacing={3}>
            <Button leftIcon={<HiCalendar />} variant="outline">
              Calendário
            </Button>
            <Button leftIcon={<HiPlus />} colorScheme="blue">
              Solicitar Férias
            </Button>
          </HStack>
        </Flex>

        <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={8}>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel color="text.subtle">Cooperados com Férias</StatLabel>
                  <StatNumber fontSize="2xl" color="brand.500">12</StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel color="text.subtle">Férias Aprovadas</StatLabel>
                  <StatNumber fontSize="2xl" color="success.500">8</StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel color="text.subtle">Férias Pendentes</StatLabel>
                  <StatNumber fontSize="2xl" color="orange.500">3</StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel color="text.subtle">Média Dias/Cooperado</StatLabel>
                  <StatNumber fontSize="2xl" color="purple.500">18</StatNumber>
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
              <Select maxW="200px" placeholder="Status">
                <option value="aprovado">Aprovado</option>
                <option value="pendente">Pendente</option>
                <option value="aguardando">Aguardando</option>
              </Select>
            </HStack>

            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Cooperado</Th>
                    <Th>Período</Th>
                    <Th isNumeric>Dias Utilizados</Th>
                    <Th>Progresso</Th>
                    <Th>Status</Th>
                    <Th>Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {vacationData.map((item) => {
                    const percentage = (item.daysUsed / item.daysTotal) * 100;
                    return (
                      <Tr key={item.id}>
                        <Td fontWeight="500">{item.collaborator}</Td>
                        <Td color="text.subtle">
                          {item.start && item.end
                            ? `${item.start} a ${item.end}`
                            : '-'}
                        </Td>
                        <Td isNumeric>
                          {item.daysUsed} / {item.daysTotal} dias
                        </Td>
                        <Td>
                          <Progress
                            value={percentage}
                            colorScheme={percentage >= 100 ? 'green' : 'blue'}
                            size="sm"
                            borderRadius="full"
                            w="100px"
                          />
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={
                              item.status === 'aprovado'
                                ? 'green'
                                : item.status === 'pendente'
                                ? 'yellow'
                                : 'gray'
                            }
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
                    );
                  })}
                </Tbody>
              </Table>
            </Box>
          </CardBody>
        </Card>
      </Box>
    </MainLayout>
  );
}
