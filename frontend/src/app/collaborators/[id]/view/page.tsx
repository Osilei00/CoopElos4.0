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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react';
import { HiArrowLeft, HiPencil } from 'react-icons/hi2';
import { MainLayout } from '@/components';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Collaborator {
  id: string;
  full_name: string;
  cpf: string;
  rg: string;
  birth_date: string;
  gender: string;
  marital_status: string;
  phone: string;
  email: string;
  address: string;
  registration: string;
  admission_date: string;
  position: string;
  base_salary: number;
  contract_type: string;
  work_regime: string;
  bank: string;
  agency: string;
  account: string;
  primary_activity: string;
  secondary_activity: string;
  other_activities: string;
  work_schedule: string;
  status: string;
  collaborator_number: number;
  vacations?: any[];
  contract_history?: any[];
}

const mockCollaborator: Collaborator = {
  id: '1',
  full_name: 'João Silva',
  cpf: '123.456.789-00',
  rg: '12.345.678-9',
  birth_date: '1985-03-15',
  gender: 'M',
  marital_status: 'casado',
  phone: '(91) 99999-9999',
  email: 'joao.silva@email.com',
  address: 'Rua das Flores, 123 - Belém/PA',
  registration: '001/2024',
  admission_date: '2024-01-15',
  position: 'enfermeiro',
  base_salary: 5500,
  contract_type: 'clt',
  work_regime: 'hospitalar',
  bank: 'Banco do Brasil',
  agency: '1234-5',
  account: '67890-1',
  primary_activity: 'Enfermagem',
  secondary_activity: 'Cirurgia',
  other_activities: 'UTI, Emergência',
  work_schedule: '07:00-17:00',
  status: 'active',
  collaborator_number: 1,
};

const InputReadOnly = ({ label, value, type = 'text' }: { label: string; value?: string; type?: string }) => (
  <FormControl>
    <FormLabel fontSize="sm" color="gray.600">{label}</FormLabel>
    <Input
      value={value || '-'}
      isReadOnly
      bg="gray.50"
      _readOnly={{ bg: 'gray.50', cursor: 'default' }}
      type={type}
    />
  </FormControl>
);

const SelectReadOnly = ({ label, value, options }: { label: string; value?: string; options: { value: string; label: string }[] }) => {
  const displayValue = options.find(o => o.value === value)?.label || value || '-';
  return (
    <FormControl>
      <FormLabel fontSize="sm" color="gray.600">{label}</FormLabel>
      <Input
        value={displayValue}
        isReadOnly
        bg="gray.50"
        _readOnly={{ bg: 'gray.50', cursor: 'default' }}
      />
    </FormControl>
  );
};

export default function ViewCollaboratorPage() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [collaborator, setCollaborator] = useState<Collaborator | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setCollaborator(mockCollaborator);
      setIsLoading(false);
    }, 800);
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
            <Link href="/collaborators">
              <IconButton
                aria-label="Voltar"
                icon={<HiArrowLeft />}
                variant="ghost"
              />
            </Link>
            <Box>
              <Heading size="lg" color="text.primary">
                Visualizar Colaborador
              </Heading>
              <Text color="text.secondary" mt={1}>
                {collaborator?.full_name} - {String(collaborator?.collaborator_number).padStart(2, '0')}
              </Text>
            </Box>
            <Badge colorScheme={collaborator?.status === 'active' ? 'green' : 'red'}>
              {collaborator?.status === 'active' ? 'Ativo' : 'Inativo'}
            </Badge>
          </HStack>
          <HStack spacing={3}>
            <Link href={`/collaborators/${params.id}`}>
              <Button leftIcon={<HiPencil />} colorScheme="blue" variant="outline">
                Editar
              </Button>
            </Link>
          </HStack>
        </Flex>

        <Card>
          <CardBody>
            <Tabs colorScheme="blue">
              <TabList mb={4}>
                <Tab>Dados Pessoais</Tab>
                <Tab>Contrato</Tab>
                <Tab>Atividades</Tab>
                <Tab>Férias</Tab>
                <Tab>Histórico</Tab>
              </TabList>

              <TabPanels>
                <TabPanel p={0}>
                  <VStack spacing={6} align="stretch">
                    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                      <GridItem>
                        <InputReadOnly label="Nome Completo" value={collaborator?.full_name} />
                      </GridItem>
                      <GridItem>
                        <InputReadOnly label="CPF" value={collaborator?.cpf} />
                      </GridItem>
                      <GridItem>
                        <InputReadOnly label="RG" value={collaborator?.rg} />
                      </GridItem>
                      <GridItem>
                        <InputReadOnly label="Data de Nascimento" value={collaborator?.birth_date} type="date" />
                      </GridItem>
                      <GridItem>
                        <SelectReadOnly
                          label="Sexo"
                          value={collaborator?.gender}
                          options={[
                            { value: 'M', label: 'Masculino' },
                            { value: 'F', label: 'Feminino' },
                          ]}
                        />
                      </GridItem>
                      <GridItem>
                        <SelectReadOnly
                          label="Estado Civil"
                          value={collaborator?.marital_status}
                          options={[
                            { value: 'solteiro', label: 'Solteiro(a)' },
                            { value: 'casado', label: 'Casado(a)' },
                            { value: 'divorciado', label: 'Divorciado(a)' },
                            { value: 'viuvo', label: 'Viúvo(a)' },
                          ]}
                        />
                      </GridItem>
                    </Grid>

                    <Divider />

                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      <GridItem>
                        <InputReadOnly label="Telefone" value={collaborator?.phone} />
                      </GridItem>
                      <GridItem>
                        <InputReadOnly label="Email" value={collaborator?.email} />
                      </GridItem>
                      <GridItem colSpan={2}>
                        <InputReadOnly label="Endereço Completo" value={collaborator?.address} />
                      </GridItem>
                    </Grid>
                  </VStack>
                </TabPanel>

                <TabPanel p={0}>
                  <VStack spacing={6} align="stretch">
                    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                      <GridItem>
                        <InputReadOnly label="Matrícula" value={collaborator?.registration} />
                      </GridItem>
                      <GridItem>
                        <InputReadOnly label="Data de Admissão" value={collaborator?.admission_date} type="date" />
                      </GridItem>
                      <GridItem>
                        <SelectReadOnly
                          label="Cargo"
                          value={collaborator?.position}
                          options={[
                            { value: 'enfermeiro', label: 'Enfermeiro(a)' },
                            { value: 'tecnico_enfermagem', label: 'Técnico(a) de Enfermagem' },
                            { value: 'auxiliar_enfermagem', label: 'Auxiliar de Enfermagem' },
                            { value: 'medico', label: 'Médico(a)' },
                            { value: 'fisioterapeuta', label: 'Fisioterapeuta' },
                            { value: 'nutricionista', label: 'Nutricionista' },
                          ]}
                        />
                      </GridItem>
                      <GridItem>
                        <InputReadOnly
                          label="Salário Base (R$)"
                          value={collaborator?.base_salary?.toLocaleString('pt-BR')}
                        />
                      </GridItem>
                      <GridItem>
                        <SelectReadOnly
                          label="Tipo de Contrato"
                          value={collaborator?.contract_type}
                          options={[
                            { value: 'clt', label: 'CLT' },
                            { value: 'pj', label: 'PJ' },
                            { value: 'estatuario', label: 'Estatutário' },
                          ]}
                        />
                      </GridItem>
                      <GridItem>
                        <SelectReadOnly
                          label="Regime de Trabalho"
                          value={collaborator?.work_regime}
                          options={[
                            { value: 'hospitalar', label: 'Hospitalar' },
                            { value: 'sad', label: 'SAD' },
                            { value: 'ambos', label: 'Ambos' },
                          ]}
                        />
                      </GridItem>
                    </Grid>

                    <Divider />

                    <Box>
                      <Heading size="sm" mb={4} color="gray.600">
                        Informações Bancárias
                      </Heading>
                      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                        <GridItem>
                          <InputReadOnly label="Banco" value={collaborator?.bank} />
                        </GridItem>
                        <GridItem>
                          <InputReadOnly label="Agência" value={collaborator?.agency} />
                        </GridItem>
                        <GridItem>
                          <InputReadOnly label="Conta" value={collaborator?.account} />
                        </GridItem>
                      </Grid>
                    </Box>
                  </VStack>
                </TabPanel>

                <TabPanel p={0}>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Heading size="sm" mb={4} color="gray.600">
                        Atividades do Cooperado
                      </Heading>
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <GridItem>
                          <InputReadOnly label="Atividade Principal" value={collaborator?.primary_activity} />
                        </GridItem>
                        <GridItem>
                          <InputReadOnly label="Atividade Secundária" value={collaborator?.secondary_activity} />
                        </GridItem>
                        <GridItem colSpan={2}>
                          <InputReadOnly label="Outras Atividades" value={collaborator?.other_activities} />
                        </GridItem>
                      </Grid>
                    </Box>

                    <Divider />

                    <Box>
                      <Heading size="sm" mb={4} color="gray.600">
                        Horário de Trabalho
                      </Heading>
                      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                        <GridItem>
                          <InputReadOnly label="Horário de Entrada" value="07:00" />
                        </GridItem>
                        <GridItem>
                          <InputReadOnly label="Horário de Saída" value="17:00" />
                        </GridItem>
                        <GridItem>
                          <InputReadOnly label="Intervalo (minutos)" value="60" />
                        </GridItem>
                      </Grid>
                    </Box>
                  </VStack>
                </TabPanel>

                <TabPanel p={0}>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Heading size="sm" mb={4} color="gray.600">
                        Períodos de Férias
                      </Heading>
                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr>
                            <Th>Início</Th>
                            <Th>Fim</Th>
                            <Th>Dias</Th>
                            <Th>Status</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {collaborator?.vacations && collaborator.vacations.length > 0 ? (
                            collaborator.vacations.map((vacation: any) => (
                              <Tr key={vacation.id}>
                                <Td>{new Date(vacation.start_date).toLocaleDateString('pt-BR')}</Td>
                                <Td>{new Date(vacation.end_date).toLocaleDateString('pt-BR')}</Td>
                                <Td>{vacation.days}</Td>
                                <Td>
                                  <Badge colorScheme={vacation.status === 'taken' ? 'green' : 'yellow'}>
                                    {vacation.status === 'taken' ? 'Gozadas' : 'Agendadas'}
                                  </Badge>
                                </Td>
                              </Tr>
                            ))
                          ) : (
                            <Tr>
                              <Td colSpan={4} textAlign="center" color="gray.500">
                                Nenhum período de férias registrado
                              </Td>
                            </Tr>
                          )}
                        </Tbody>
                      </Table>
                    </Box>
                  </VStack>
                </TabPanel>

                <TabPanel p={0}>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Heading size="sm" mb={4} color="gray.600">
                        Histórico Contratual
                      </Heading>
                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr>
                            <Th>Data</Th>
                            <Th>Cargo</Th>
                            <Th>Salário</Th>
                            <Th>Motivo</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {collaborator?.contract_history && collaborator.contract_history.length > 0 ? (
                            collaborator.contract_history.map((history: any) => (
                              <Tr key={history.id}>
                                <Td>{new Date(history.change_date).toLocaleDateString('pt-BR')}</Td>
                                <Td>{history.position || '-'}</Td>
                                <Td>
                                  {new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                  }).format(history.salary)}
                                </Td>
                                <Td>{history.reason || '-'}</Td>
                              </Tr>
                            ))
                          ) : (
                            <Tr>
                              <Td colSpan={4} textAlign="center" color="gray.500">
                                Nenhum registro de histórico
                              </Td>
                            </Tr>
                          )}
                        </Tbody>
                      </Table>
                    </Box>
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
