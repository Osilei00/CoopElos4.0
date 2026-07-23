'use client';

import { useRef, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Card,
  CardBody,
  Button,
  Flex,
  HStack,
  VStack,
  Skeleton,
  SkeletonText,
  Badge,
  Alert,
  AlertIcon,
  Grid,
  GridItem,
  IconButton,
  Divider,
  Image,
  Tooltip,
  useToast,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import {
  HiArrowLeft,
  HiPencil,
  HiHashtag,
  HiUser,
  HiTrash,
  HiDocument,
  HiCurrencyDollar,
  HiCalendarDays,
  HiClock,
} from 'react-icons/hi2';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from '@/components';
import {
  useCooperado,
  useDeleteCooperado,
  useDocuments,
  useContractHistory,
} from '@/hooks';

interface Cooperado {
  id: string;
  cooperado_number: number | null;
  status: string;
  venc_cooperados: string | null;
  matricula: string | null;
  nome_cooperado: string | null;
  cpf_cooperado: string | null;
  rg: string | null;
  nis_pis: string | null;
  ctps_serie: string | null;
  nacionalidade: string | null;
  naturalidade: string | null;
  nascimento: string | null;
  sexo: string | null;
  estado_civil: string | null;
  escolaridade: string | null;
  nome_pai: string | null;
  nome_mae: string | null;
  nome_conjuge: string | null;
  cpf_conjuge: string | null;
  celular_cooperado: string | null;
  telefone_residencial: string | null;
  email_cooperado: string | null;
  celular_indicador: string | null;
  email_indicador: string | null;
  nome_indicacao: string | null;
  email_gestor: string | null;
  endereco: string | null;
  bairro: string | null;
  complemento: string | null;
  cep: string | null;
  cidade: string | null;
  estado: string | null;
  empresa_trabalho: string | null;
  cargo_pretendido: string | null;
  cargo_contratado: string | null;
  salario: string | null;
  data_admissao: string | null;
  data_cadastro: string | null;
  ativ_coop_dropa: string | null;
  ativ_coop_dropb: string | null;
  atividades_cooperados: string | null;
  outras_ativd_profissionais: string | null;
  banco: string | null;
  agencia: string | null;
  conta_corrente: string | null;
  pix: string | null;
  capital_social: string | null;
  carteira_registro: string | null;
  atestados_tecnicos: string | null;
  curriculo_profissional: string | null;
  descricao_sucinta: string | null;
  valor_acumulado: string | null;
  valor_atual: string | null;
  valor_integralizado: string | null;
  valor_var: string | null;
  parcelas: string | null;
  em_aberto: string | null;
  local_cadastro: string | null;
  slug: string | null;
  imagem_cooperado: string | null;
}

interface ContractHistoryItem {
  id: string;
  cargo: string | null;
  salario: number | null;
  data_admissao: string | null;
  data_saida: string | null;
  motivo: string | null;
  observacoes: string | null;
  created_at: string;
}

interface DocumentItem {
  id: string;
  name: string;
  mime_type: string;
  file_size: number;
  created_at: string;
}

const formatDateBR = (date: string | null | undefined) => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString('pt-BR');
};

const formatCurrency = (value: string | null | undefined) => {
  if (!value) return null;
  const num = parseFloat(value.replace(',', '.'));
  if (isNaN(num)) return value;
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const Field = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <Box>
    <Text
      fontSize="xs"
      textTransform="uppercase"
      letterSpacing="wider"
      mb={1}
    >
      {label}
    </Text>
    <Text fontSize="sm" fontWeight="500" wordBreak="break-word">
      {value || '—'}
    </Text>
  </Box>
);

const SectionCard = ({
  title,
  fields,
}: {
  title: string;
  fields: { label: string; value: string | null | undefined }[];
}) => (
  <Card mb={4}>
    <CardBody>
      <Heading size="sm" mb={4}>
        {title}
      </Heading>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={5}>
        {fields.map((f) => (
          <GridItem key={f.label}>
            <Field label={f.label} value={f.value} />
          </GridItem>
        ))}
      </Grid>
    </CardBody>
  </Card>
);

export default function ViewCooperadoPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const deleteCooperado = useDeleteCooperado();
  const { data: cooperado, isLoading, isError } = useCooperado(id);
  const { data: documents = [] } = useDocuments(id);
  const { data: contractHistory = [] } = useContractHistory(id);
  const [activeTab, setActiveTab] = useState(0);

  const handleDelete = async () => {
    try {
      await deleteCooperado.mutateAsync(id);
      toast({
        title: 'Cooperado inativado',
        description: 'O cooperado foi marcado como inativo.',
        status: 'success',
        duration: 3000,
      });
      router.push('/cooperados');
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Não foi possível inativar o cooperado.';
      toast({
        title: 'Erro ao inativar',
        description: message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      onClose();
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <Box>
          <HStack spacing={4} mb={6}>
            <Skeleton h="40px" w="40px" borderRadius="md" />
            <Box flex={1}>
              <Skeleton h="32px" w="240px" mb={2} />
              <SkeletonText w="180px" noOfLines={1} />
            </Box>
          </HStack>
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} mb={4}>
              <CardBody>
                <Skeleton h="20px" w="160px" mb={4} />
                <VStack spacing={3} align="stretch">
                  <Skeleton h="16px" w="100%" />
                  <Skeleton h="16px" w="80%" />
                </VStack>
              </CardBody>
            </Card>
          ))}
        </Box>
      </MainLayout>
    );
  }

  if (isError || !cooperado) {
    return (
      <MainLayout>
        <Box>
          <Flex justifyContent="space-between" alignItems="center" mb={6}>
            <HStack spacing={4}>
              <Tooltip label="Voltar">
                <IconButton
                  as={Link}
                  href="/cooperados"
                  aria-label="Voltar"
                  icon={<HiArrowLeft />}
                  variant="ghost"
                />
              </Tooltip>
              <Heading size="lg">
                Cooperado
              </Heading>
            </HStack>
          </Flex>
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            Cooperado não encontrado ou erro ao carregar dados.
          </Alert>
          <Button mt={4} onClick={() => router.push('/cooperados')}>
            Voltar para a lista
          </Button>
        </Box>
      </MainLayout>
    );
  }

  const c = cooperado as Cooperado;
  const isActive = c.status === 'active';
  const birthDate = formatDateBR(c.nascimento);
  const admissionDate = formatDateBR(c.data_admissao);
  const registerDate = formatDateBR(c.data_cadastro);

  return (
    <MainLayout>
      <Box>
        <Flex
          justifyContent="space-between"
          alignItems={{ base: 'flex-start', md: 'center' }}
          mb={6}
          flexDir={{ base: 'column', md: 'row' }}
          gap={4}
        >
          <HStack spacing={4} align="center">
            <Tooltip label="Voltar">
              <IconButton
                as={Link}
                href="/cooperados"
                aria-label="Voltar"
                icon={<HiArrowLeft />}
                variant="ghost"
              />
            </Tooltip>
            {c.imagem_cooperado && (
              <Image
                src={c.imagem_cooperado}
                alt={c.nome_cooperado || 'Cooperado'}
                boxSize="80px"
                borderRadius="full"
                objectFit="cover"
                border="2px solid"
                borderColor="brand.500"
                fallbackSrc="https://via.placeholder.com/80?text=?"
              />
            )}
            <Box>
              <HStack spacing={3} align="center" mb={1}>
                {c.cooperado_number != null && (
                  <HStack
                    spacing={1}
                    bg="brand.50"
                    color="brand.700"
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    <HiHashtag />
                    <Text fontWeight="700" fontSize="sm">
                      {String(c.cooperado_number).padStart(2, '0')}
                    </Text>
                  </HStack>
                )}
                <Badge
                  colorScheme={isActive ? 'green' : 'red'}
                  fontSize="xs"
                  px={2}
                  py={1}
                  borderRadius="full"
                >
                  {isActive ? 'Ativo' : 'Inativo'}
                </Badge>
              </HStack>
              <Heading size="lg">
                {c.nome_cooperado || 'Sem nome'}
              </Heading>
              <Text fontSize="sm" mt={1}>
                {c.cargo_pretendido || c.cargo_contratado || 'Sem cargo definido'}
                {c.matricula ? ` • Matrícula ${c.matricula}` : ''}
              </Text>
            </Box>
          </HStack>
          <HStack spacing={3}>
            <Link href={`/cooperados/${c.id}/edit`}>
              <Button leftIcon={<HiPencil />} colorScheme="brand">
                Editar
              </Button>
            </Link>
          </HStack>
        </Flex>

        <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed">
          <TabList>
            <Tab>
              <HStack spacing={2}>
                <HiUser />
                <Text>Dados</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack spacing={2}>
                <HiDocument />
                <Text>Documentos</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack spacing={2}>
                <HiCurrencyDollar />
                <Text>Folha</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack spacing={2}>
                <HiCalendarDays />
                <Text>Férias</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack spacing={2}>
                <HiClock />
                <Text>Histórico</Text>
              </HStack>
            </Tab>
          </TabList>

          <TabPanels>
            {/* Aba: Dados */}
            <TabPanel p={0} pt={4}>
              <SectionCard
                title="Identificação"
                fields={[
                  { label: 'Matrícula', value: c.matricula },
                  { label: 'CPF', value: c.cpf_cooperado },
                  { label: 'RG', value: c.rg },
                  { label: 'NIS/PIS', value: c.nis_pis },
                  { label: 'CTPS/Série', value: c.ctps_serie },
                  { label: 'Data de Nascimento', value: birthDate },
                  { label: 'Estado Civil', value: c.estado_civil },
                  { label: 'Sexo', value: c.sexo },
                ]}
              />

              <SectionCard
                title="Filiação e Origem"
                fields={[
                  { label: 'Nacionalidade', value: c.nacionalidade },
                  { label: 'Naturalidade', value: c.naturalidade },
                  { label: 'Escolaridade', value: c.escolaridade },
                  { label: 'Nome do Pai', value: c.nome_pai },
                  { label: 'Nome da Mãe', value: c.nome_mae },
                  { label: 'Nome do Cônjuge', value: c.nome_conjuge },
                  { label: 'CPF do Cônjuge', value: c.cpf_conjuge },
                ]}
              />

              <SectionCard
                title="Contato"
                fields={[
                  { label: 'Celular', value: c.celular_cooperado },
                  { label: 'Telefone Residencial', value: c.telefone_residencial },
                  { label: 'Email', value: c.email_cooperado },
                  { label: 'Nome da Indicação', value: c.nome_indicacao },
                  { label: 'Celular do Indicador', value: c.celular_indicador },
                  { label: 'Email do Indicador', value: c.email_indicador },
                  { label: 'Email do Gestor', value: c.email_gestor },
                ]}
              />

              <SectionCard
                title="Endereço"
                fields={[
                  { label: 'Endereço', value: c.endereco },
                  { label: 'Bairro', value: c.bairro },
                  { label: 'Complemento', value: c.complemento },
                  { label: 'CEP', value: c.cep },
                  { label: 'Cidade', value: c.cidade },
                  { label: 'Estado (UF)', value: c.estado },
                ]}
              />

              <SectionCard
                title="Dados Profissionais"
                fields={[
                  { label: 'Empresa de Trabalho', value: c.empresa_trabalho },
                  { label: 'Cargo Pretendido', value: c.cargo_pretendido },
                  { label: 'Cargo Contratado', value: c.cargo_contratado },
                  { label: 'Salário', value: formatCurrency(c.salario) },
                  { label: 'Data de Admissão', value: admissionDate },
                  { label: 'Data de Cadastro', value: registerDate },
                ]}
              />

              <SectionCard
                title="Dados Bancários"
                fields={[
                  { label: 'Banco', value: c.banco },
                  { label: 'Agência', value: c.agencia },
                  { label: 'Conta Corrente', value: c.conta_corrente },
                  { label: 'Chave PIX', value: c.pix },
                  { label: 'Capital Social', value: formatCurrency(c.capital_social) },
                ]}
              />
            </TabPanel>

            {/* Aba: Documentos */}
            <TabPanel p={0} pt={4}>
              <Card>
                <CardBody>
                  <Flex justifyContent="space-between" alignItems="center" mb={4}>
                    <Heading size="sm">Documentos do Cooperado</Heading>
                    <Link href={`/cooperados/${c.id}/edit`}>
                      <Button size="sm" leftIcon={<HiDocument />} colorScheme="brand" variant="outline">
                        Gerenciar Documentos
                      </Button>
                    </Link>
                  </Flex>
                  {(documents as DocumentItem[]).length === 0 ? (
                    <Alert status="info" borderRadius="md">
                      <AlertIcon />
                      Nenhum documento cadastrado para este cooperado.
                    </Alert>
                  ) : (
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>Nome</Th>
                          <Th>Tipo</Th>
                          <Th>Tamanho</Th>
                          <Th>Data de Upload</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {(documents as DocumentItem[]).map((doc) => (
                          <Tr key={doc.id}>
                            <Td>{doc.name}</Td>
                            <Td>
                              <Badge colorScheme="blue" fontSize="xs">
                                {doc.mime_type.split('/').pop()?.toUpperCase()}
                              </Badge>
                            </Td>
                            <Td>
                              {(doc.file_size / 1024).toFixed(1)} KB
                            </Td>
                            <Td>{formatDateBR(doc.created_at)}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  )}
                </CardBody>
              </Card>
            </TabPanel>

            {/* Aba: Folha */}
            <TabPanel p={0} pt={4}>
              <Card>
                <CardBody>
                  <Heading size="sm" mb={4}>
                    Itens de Folha de Pagamento
                  </Heading>
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    A folha de pagamento deste cooperado pode ser visualizada na seção de Folha de Pagamento.
                  </Alert>
                  <Box mt={4}>
                    <Link href="/payroll">
                      <Button size="sm" variant="outline">
                        Ver Folhas de Pagamento
                      </Button>
                    </Link>
                  </Box>
                </CardBody>
              </Card>
            </TabPanel>

            {/* Aba: Férias */}
            <TabPanel p={0} pt={4}>
              <Card>
                <CardBody>
                  <Heading size="sm" mb={4}>
                    Controle de Férias
                  </Heading>
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    As férias deste cooperado podem ser gerenciadas na seção de Férias.
                  </Alert>
                  <Box mt={4}>
                    <Link href="/vacations">
                      <Button size="sm" variant="outline">
                        Ver Férias
                      </Button>
                    </Link>
                  </Box>
                </CardBody>
              </Card>
            </TabPanel>

            {/* Aba: Histórico */}
            <TabPanel p={0} pt={4}>
              <Card>
                <CardBody>
                  <Heading size="sm" mb={4}>
                    Histórico Contratual
                  </Heading>
                  {(contractHistory as ContractHistoryItem[]).length === 0 ? (
                    <Alert status="info" borderRadius="md">
                      <AlertIcon />
                      Nenhum registro de histórico contratual encontrado.
                    </Alert>
                  ) : (
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>Cargo</Th>
                          <Th>Salário</Th>
                          <Th>Data Admissão</Th>
                          <Th>Data Saída</Th>
                          <Th>Motivo</Th>
                          <Th>Observações</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {(contractHistory as ContractHistoryItem[]).map((item) => (
                          <Tr key={item.id}>
                            <Td>{item.cargo || '—'}</Td>
                            <Td>{item.salario ? formatCurrency(String(item.salario)) : '—'}</Td>
                            <Td>{formatDateBR(item.data_admissao)}</Td>
                            <Td>{formatDateBR(item.data_saida)}</Td>
                            <Td>{item.motivo || '—'}</Td>
                            <Td>{item.observacoes || '—'}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  )}
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Divider my={4} />
        <Flex justifyContent="space-between" pb={8} alignItems="center" flexWrap="wrap" gap={3}>
          <Button
            leftIcon={<HiTrash />}
            variant="outline"
            colorScheme="red"
            onClick={onOpen}
            isDisabled={!isActive}
          >
            Inativar
          </Button>
          <HStack spacing={3}>
            <Link href="/cooperados">
              <Button variant="ghost">Voltar para a lista</Button>
            </Link>
            <Link href={`/cooperados/${c.id}/edit`}>
              <Button leftIcon={<HiPencil />} colorScheme="brand">
                Editar
              </Button>
            </Link>
          </HStack>
        </Flex>
      </Box>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Inativar cooperado
            </AlertDialogHeader>
            <AlertDialogBody>
              Tem certeza que deseja inativar {c.nome_cooperado || 'este cooperado'}?
              O registro não será excluído do banco, apenas marcado como inativo.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} variant="ghost">
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                isLoading={deleteCooperado.isPending}
              >
                Inativar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </MainLayout>
  );
}
