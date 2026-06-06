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
  Skeleton,
  SkeletonText,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { HiArrowLeft, HiCheck, HiUser, HiTrash } from 'react-icons/hi2';
import { MainLayout } from '@/components';
import { FileUploader } from '@/components/FileUploader';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Collaborator {
  id: string;
  name: string;
  cpf: string;
  rg: string;
  birthDate: string;
  gender: string;
  maritalStatus: string;
  phone: string;
  email: string;
  address: string;
  registration: string;
  admissionDate: string;
  role: string;
  baseSalary: number;
  contractType: string;
  workRegime: string;
  bank: string;
  agency: string;
  account: string;
  primaryActivity: string;
  secondaryActivity: string;
  otherActivities: string;
  workSchedule: string;
  status: string;
  vacations?: any[];
  contract_history?: any[];
}

const mockCollaborator: Collaborator = {
  id: '1',
  name: 'João Silva',
  cpf: '123.456.789-00',
  rg: '12.345.678-9',
  birthDate: '1985-03-15',
  gender: 'M',
  maritalStatus: 'casado',
  phone: '(91) 99999-9999',
  email: 'joao.silva@email.com',
  address: 'Rua das Flores, 123 - Belém/PA',
  registration: '001/2024',
  admissionDate: '2024-01-15',
  role: 'enfermeiro',
  baseSalary: 5500,
  contractType: 'clt',
  workRegime: 'hospitalar',
  bank: 'Banco do Brasil',
  agency: '1234-5',
  account: '67890-1',
  primaryActivity: 'Enfermagem',
  secondaryActivity: 'Cirurgia',
  otherActivities: 'UTI, Emergência',
  workSchedule: '07:00-17:00',
  status: 'active',
};

export default function EditCollaboratorPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [collaborator, setCollaborator] = useState<Collaborator | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setCollaborator(mockCollaborator);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: 'Colaborador atualizado',
        description: 'Os dados foram salvos com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.push('/collaborators');
    }, 1500);
  };

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
                Editar Colaborador
              </Heading>
              <Text color="text.secondary" mt={1}>
                {collaborator?.name} - {collaborator?.registration}
              </Text>
            </Box>
            <Badge colorScheme="green">{collaborator?.status}</Badge>
          </HStack>
          <HStack spacing={3}>
            <Button
              leftIcon={<HiTrash />}
              colorScheme="red"
              variant="ghost"
              onClick={() => {
                toast({
                  title: 'Colaborador desativado',
                  status: 'info',
                  duration: 3000,
                });
                router.push('/collaborators');
              }}
            >
              Desativar
            </Button>
            <Button variant="outline" onClick={() => router.push('/collaborators')}>
              Cancelar
            </Button>
            <Button
              leftIcon={<HiCheck />}
              colorScheme="blue"
              onClick={handleSave}
              isLoading={isSaving}
            >
              Salvar
            </Button>
          </HStack>
        </Flex>

        <Card>
          <CardBody>
            <Tabs colorScheme="blue">
              <TabList mb={4}>
                <Tab>Dados Pessoais</Tab>
                <Tab>Contrato</Tab>
                <Tab>Atividades</Tab>
                <Tab>Documentos</Tab>
                <Tab>Férias</Tab>
                <Tab>Histórico</Tab>
              </TabList>

              <TabPanels>
                <TabPanel p={0}>
                  <VStack spacing={6} align="stretch">
                    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Nome Completo</FormLabel>
                          <Input defaultValue={collaborator?.name} />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>CPF</FormLabel>
                          <Input defaultValue={collaborator?.cpf} />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>RG</FormLabel>
                          <Input defaultValue={collaborator?.rg} />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Data de Nascimento</FormLabel>
                          <Input type="date" defaultValue={collaborator?.birthDate} />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Sexo</FormLabel>
                          <Select defaultValue={collaborator?.gender}>
                            <option value="M">Masculino</option>
                            <option value="F">Feminino</option>
                          </Select>
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Estado Civil</FormLabel>
                          <Select defaultValue={collaborator?.maritalStatus}>
                            <option value="solteiro">Solteiro(a)</option>
                            <option value="casado">Casado(a)</option>
                            <option value="divorciado">Divorciado(a)</option>
                            <option value="viuvo">Viúvo(a)</option>
                          </Select>
                        </FormControl>
                      </GridItem>
                    </Grid>

                    <Divider />

                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Telefone</FormLabel>
                          <Input defaultValue={collaborator?.phone} />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Email</FormLabel>
                          <Input type="email" defaultValue={collaborator?.email} />
                        </FormControl>
                      </GridItem>
                      <GridItem colSpan={2}>
                        <FormControl isRequired>
                          <FormLabel>Endereço Completo</FormLabel>
                          <Input defaultValue={collaborator?.address} />
                        </FormControl>
                      </GridItem>
                    </Grid>
                  </VStack>
                </TabPanel>

                <TabPanel p={0}>
                  <VStack spacing={6} align="stretch">
                    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Matrícula</FormLabel>
                          <Input defaultValue={collaborator?.registration} />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Data de Admissão</FormLabel>
                          <Input type="date" defaultValue={collaborator?.admissionDate} />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Cargo</FormLabel>
                          <Select defaultValue={collaborator?.role}>
                            <option value="enfermeiro">Enfermeiro(a)</option>
                            <option value="tecnico_enfermagem">Técnico(a) de Enfermagem</option>
                            <option value="auxiliar_enfermagem">Auxiliar de Enfermagem</option>
                            <option value="medico">Médico(a)</option>
                            <option value="fisioterapeuta">Fisioterapeuta</option>
                            <option value="nutricionista">Nutricionista</option>
                          </Select>
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Salário Base (R$)</FormLabel>
                          <Input type="number" defaultValue={collaborator?.baseSalary} />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Tipo de Contrato</FormLabel>
                          <Select defaultValue={collaborator?.contractType}>
                            <option value="clt">CLT</option>
                            <option value="pj">PJ</option>
                            <option value="estatuario">Estatutário</option>
                          </Select>
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Regime de Trabalho</FormLabel>
                          <Select defaultValue={collaborator?.workRegime}>
                            <option value="hospitalar">Hospitalar</option>
                            <option value="sad">SAD</option>
                            <option value="ambos">Ambos</option>
                          </Select>
                        </FormControl>
                      </GridItem>
                    </Grid>

                    <Divider />

                    <Box>
                      <Heading size="sm" mb={4} color="text.subtle">
                        Informações Bancárias
                      </Heading>
                      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Banco</FormLabel>
                            <Input defaultValue={collaborator?.bank} />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Agência</FormLabel>
                            <Input defaultValue={collaborator?.agency} />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Conta</FormLabel>
                            <Input defaultValue={collaborator?.account} />
                          </FormControl>
                        </GridItem>
                      </Grid>
                    </Box>
                  </VStack>
                </TabPanel>

                <TabPanel p={0}>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Heading size="sm" mb={4} color="text.subtle">
                        Atividades do Cooperado
                      </Heading>
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Atividade Principal (Coop DropA)</FormLabel>
                            <Input defaultValue={collaborator?.primaryActivity} />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Atividade Secundária (Coop DropB)</FormLabel>
                            <Input defaultValue={collaborator?.secondaryActivity} />
                          </FormControl>
                        </GridItem>
                        <GridItem colSpan={2}>
                          <FormControl>
                            <FormLabel>Outras Atividades</FormLabel>
                            <Input defaultValue={collaborator?.otherActivities} />
                          </FormControl>
                        </GridItem>
                      </Grid>
                    </Box>

                    <Divider />

                    <Box>
                      <Heading size="sm" mb={4} color="text.subtle">
                        Horário de Trabalho
                      </Heading>
                      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Horário de Entrada</FormLabel>
                            <Input type="time" defaultValue="07:00" />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Horário de Saída</FormLabel>
                            <Input type="time" defaultValue="17:00" />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Intervalo (minutos)</FormLabel>
                            <Input type="number" defaultValue="60" />
                          </FormControl>
                        </GridItem>
                      </Grid>
                    </Box>
                  </VStack>
                </TabPanel>

                {/* Documentos Tab */}
                <TabPanel p={0}>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Heading size="sm" mb={4} color="text.subtle">
                        Upload de Documentos
                      </Heading>
                      <FileUploader collaboratorId={params.id as string} />
                    </Box>

                    <Divider />

                    <Box>
                      <Heading size="sm" mb={4} color="text.subtle">
                        Assinatura
                      </Heading>
                      <FormControl>
                        <FormLabel>Assinatura Digital</FormLabel>
                        <Input defaultValue="https://s3.amazonaws.com/assinaturas/joao-silva.png" />
                      </FormControl>
                    </Box>
                  </VStack>
                </TabPanel>

                {/* Férias Tab */}
                <TabPanel p={0}>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Heading size="sm" mb={4} color="text.subtle">
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
                              <Td colSpan={4} textAlign="center" color="text.subtle">
                                Nenhum período de férias registrado
                              </Td>
                            </Tr>
                          )}
                        </Tbody>
                      </Table>
                    </Box>
                  </VStack>
                </TabPanel>

                {/* Histórico Tab */}
                <TabPanel p={0}>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Heading size="sm" mb={4} color="text.subtle">
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
                              <Td colSpan={4} textAlign="center" color="text.subtle">
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
