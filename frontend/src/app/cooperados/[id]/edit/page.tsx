'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Heading,
  Text,
  Card,
  CardBody,
  Button,
  Flex,
  Input,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  useToast,
  VStack,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  Skeleton,
  SkeletonText,
  IconButton,
  Tooltip,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { HiArrowLeft, HiCheck } from 'react-icons/hi2';
import Link from 'next/link';
import { MainLayout, ActivityCheckboxGroup, DocumentCheckboxGroup } from '@/components';
import { useCooperado, useUpdateCooperado } from '@/hooks';
import { maskCpf, maskPhone, maskCurrency } from '@/lib/masks';
import { BRAZILIAN_STATES } from '@/lib/constants';

type FormState = Record<string, string>;

const initialForm: FormState = {
  nome_cooperado: '',
  cpf_cooperado: '',
  rg: '',
  nis_pis: '',
  ctps_serie: '',
  nacionalidade: '',
  naturalidade: '',
  nascimento: '',
  sexo: '',
  estado_civil: '',
  escolaridade: '',
  nome_pai: '',
  nome_mae: '',
  nome_conjuge: '',
  cpf_conjuge: '',
  celular_cooperado: '',
  telefone_residencial: '',
  email_cooperado: '',
  celular_indicador: '',
  email_indicador: '',
  nome_indicacao: '',
  email_gestor: '',
  endereco: '',
  bairro: '',
  complemento: '',
  cep: '',
  cidade: '',
  estado: '',
  empresa_trabalho: '',
  cargo_pretendido: '',
  cargo_contratado: '',
  salario: '',
  data_admissao: '',
  data_cadastro: '',
  ativ_coop_dropa: '',
  ativ_coop_dropb: '',
  atividades_cooperados: '',
  outras_ativd_profissionais: '',
  banco: '',
  agencia: '',
  conta_corrente: '',
  pix: '',
  capital_social: '',
  carteira_registro: '',
  atestados_tecnicos: '',
  curriculo_profissional: '',
  descricao_sucinta: '',
  valor_acumulado: '',
  valor_atual: '',
  valor_integralizado: '',
  valor_var: '',
  parcelas: '',
  em_aberto: '',
  local_cadastro: '',
  venc_cooperados: '',
  matricula: '',
  slug: '',
  imagem_cooperado: '',
  documentos: '',
  status: 'active',
};

const DATE_FIELDS = new Set(['nascimento', 'data_admissao', 'data_cadastro']);

const toDateInput = (value: unknown): string => {
  if (!value) return '';
  const d = new Date(value as string);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
};

const toNullIfEmpty = (value: string) => (value === '' ? null : value);

export default function EditCooperadoPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const toast = useToast();
  const { data: cooperado, isLoading, isError } = useCooperado(id);
  const updateCooperado = useUpdateCooperado();
  const [form, setForm] = useState<FormState>(initialForm);
  const hydratedRef = useRef(false);
  const [hydrated, setHydrated] = useState(false);
  const [declaracaoUrl, setDeclaracaoUrl] = useState<string | null>(null);
  const declaracaoFileRef = useRef<HTMLInputElement>(null);
  const [uploadingDeclaracao, setUploadingDeclaracao] = useState(false);
  const [reciboUrl, setReciboUrl] = useState<string | null>(null);
  const reciboFileRef = useRef<HTMLInputElement>(null);
  const [uploadingRecibo, setUploadingRecibo] = useState(false);
  const [quitacaoUrl, setQuitacaoUrl] = useState<string | null>(null);
  const quitacaoFileRef = useRef<HTMLInputElement>(null);
  const [uploadingQuitacao, setUploadingQuitacao] = useState(false);

  useEffect(() => {
    if (!cooperado || hydratedRef.current) return;
    const c = cooperado as Record<string, unknown>;
    const next: FormState = { ...initialForm };
    for (const key of Object.keys(initialForm)) {
      const raw = c[key];
      if (DATE_FIELDS.has(key)) {
        next[key] = toDateInput(raw);
      } else if (raw == null) {
        next[key] = '';
      } else {
        next[key] = String(raw);
      }
    }
    hydratedRef.current = true;
    setForm(next);
    setHydrated(true);
  }, [cooperado]);

  useEffect(() => {
    if (hydrated) {
      hydratedRef.current = true;
    }
  }, [hydrated]);

  useEffect(() => {
    if (cooperado && (cooperado as any).declaracao_adesao_url) {
      setDeclaracaoUrl((cooperado as any).declaracao_adesao_url);
    }
    if (cooperado && (cooperado as any).recibo_contribuicao_url) {
      setReciboUrl((cooperado as any).recibo_contribuicao_url);
    }
    if (cooperado && (cooperado as any).declaracao_quitacao_url) {
      setQuitacaoUrl((cooperado as any).declaracao_quitacao_url);
    }
  }, [cooperado]);

  const handleDeclaracaoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: 'Formato inválido',
        description: 'Apenas arquivos PDF são aceitos.',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setUploadingDeclaracao(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/proxy/cooperados/${id}/declaracao-adesao`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Erro no upload');

      const result = await response.json();
      setDeclaracaoUrl(result.declaracao_adesao_url);
      toast({
        title: 'Declaração enviada',
        description: 'PDF da declaração de adesão salvo com sucesso.',
        status: 'success',
        duration: 3000,
      });
    } catch {
      toast({
        title: 'Erro no upload',
        description: 'Não foi possível enviar o arquivo.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setUploadingDeclaracao(false);
      if (declaracaoFileRef.current) declaracaoFileRef.current.value = '';
    }
  };

  const handleReciboUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: 'Formato inválido',
        description: 'Apenas arquivos PDF são aceitos.',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setUploadingRecibo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/proxy/cooperados/${id}/recibo-contribuicao`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Erro no upload');

      const result = await response.json();
      setReciboUrl(result.recibo_contribuicao_url);
      toast({
        title: 'Recibo enviado',
        description: 'PDF do recibo de contribuição salvo com sucesso.',
        status: 'success',
        duration: 3000,
      });
    } catch {
      toast({
        title: 'Erro no upload',
        description: 'Não foi possível enviar o arquivo.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setUploadingRecibo(false);
      if (reciboFileRef.current) reciboFileRef.current.value = '';
    }
  };

  const handleQuitacaoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: 'Formato inválido',
        description: 'Apenas arquivos PDF são aceitos.',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setUploadingQuitacao(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/proxy/cooperados/${id}/declaracao-quitacao`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Erro no upload');

      const result = await response.json();
      setQuitacaoUrl(result.declaracao_quitacao_url);
      toast({
        title: 'Declaração de quitação enviada',
        description: 'PDF da declaração de quitação salvo com sucesso.',
        status: 'success',
        duration: 3000,
      });
    } catch {
      toast({
        title: 'Erro no upload',
        description: 'Não foi possível enviar o arquivo.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setUploadingQuitacao(false);
      if (quitacaoFileRef.current) quitacaoFileRef.current.value = '';
    }
  };

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!form.nome_cooperado.trim()) {
      toast({
        title: 'Nome obrigatório',
        description: 'Preencha o nome do cooperado.',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    const payload: Record<string, string | null> = {};
    for (const [key, value] of Object.entries(form)) {
      if (DATE_FIELDS.has(key)) {
        payload[key] = value === '' ? null : new Date(value).toISOString();
      } else {
        payload[key] = toNullIfEmpty(value);
      }
    }

    try {
      await updateCooperado.mutateAsync({ id, data: payload });
      toast({
        title: 'Cooperado atualizado',
        description: 'Alterações salvas com sucesso.',
        status: 'success',
        duration: 3000,
      });
      router.push(`/cooperados/${id}`);
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Tente novamente.';
      toast({
        title: 'Erro ao salvar',
        description: message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  if (isLoading || !hydrated) {
    return (
      <MainLayout>
        <Box maxW="900px" mx="auto">
          <HStack spacing={4} mb={6}>
            <Skeleton h="40px" w="40px" borderRadius="md" />
            <Box flex={1}>
              <Skeleton h="32px" w="240px" mb={2} />
              <SkeletonText w="180px" noOfLines={1} />
            </Box>
          </HStack>
          <Card mb={4}>
            <CardBody>
              <VStack spacing={3} align="stretch">
                <Skeleton h="20px" w="100%" />
                <Skeleton h="20px" w="100%" />
                <Skeleton h="20px" w="80%" />
              </VStack>
            </CardBody>
          </Card>
        </Box>
      </MainLayout>
    );
  }

  if (isError || !cooperado) {
    return (
      <MainLayout>
        <Box maxW="900px" mx="auto">
          <Flex justifyContent="space-between" alignItems="center" mb={6}>
            <HStack spacing={3}>
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
                Editar Cooperado
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

  const cooperadoName = (cooperado as { nome_cooperado?: string }).nome_cooperado || 'Cooperado';

  return (
    <MainLayout>
      <Box maxW="900px" mx="auto">
        <Flex
          justifyContent="space-between"
          alignItems={{ base: 'flex-start', md: 'center' }}
          mb={6}
          flexDir={{ base: 'column', md: 'row' }}
          gap={4}
        >
          <Box>
            <Heading size="lg">
              Editar Cooperado
            </Heading>
            <Text>
              {cooperadoName}
            </Text>
          </Box>
          <HStack spacing={3}>
            <Link href={`/cooperados/${id}`}>
              <Button leftIcon={<HiArrowLeft />} variant="ghost">
                Voltar
              </Button>
            </Link>
            <Button
              colorScheme="brand"
              leftIcon={<HiCheck />}
              onClick={handleSave}
              isLoading={updateCooperado.isPending}
            >
              Salvar
            </Button>
          </HStack>
        </Flex>

        <Accordion defaultIndex={[0]} allowMultiple>
          <Card mb={4}>
            <AccordionItem border="none">
              <AccordionButton px={6} py={3}>
                <Box flex="1" textAlign="left">
                  <HStack>
                    <Heading size="sm">Dados Pessoais</Heading>
                    <Badge colorScheme="blue" fontSize="xs">
                      Obrigatório
                    </Badge>
                  </HStack>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6} px={6}>
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Nome Completo</FormLabel>
                    <Input
                      placeholder="Nome completo do cooperado"
                      value={form.nome_cooperado}
                      onChange={(e) => update('nome_cooperado', e.target.value)}
                      size="sm"
                    />
                  </FormControl>
                  <Flex gap={4}>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">CPF</FormLabel>
                        <Input
                          placeholder="000.000.000-00"
                          value={form.cpf_cooperado}
                          onChange={(e) => update('cpf_cooperado', maskCpf(e.target.value))}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">RG</FormLabel>
                        <Input
                          value={form.rg}
                          onChange={(e) => update('rg', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                  </Flex>
                  <Flex gap={4}>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">NIS/PIS</FormLabel>
                        <Input
                          value={form.nis_pis}
                          onChange={(e) => update('nis_pis', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">CTPS/Série</FormLabel>
                        <Input
                          value={form.ctps_serie}
                          onChange={(e) => update('ctps_serie', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                  </Flex>
                  <Flex gap={4}>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Nacionalidade</FormLabel>
                        <Input
                          value={form.nacionalidade}
                          onChange={(e) => update('nacionalidade', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Naturalidade</FormLabel>
                        <Input
                          value={form.naturalidade}
                          onChange={(e) => update('naturalidade', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                  </Flex>
                  <Flex gap={4}>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Data de Nascimento</FormLabel>
                        <Input
                          type="date"
                          value={form.nascimento}
                          onChange={(e) => update('nascimento', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Sexo</FormLabel>
                        <Select
                          placeholder="Selecione..."
                          value={form.sexo}
                          onChange={(e) => update('sexo', e.target.value)}
                          size="sm"
                        >
                          <option value="M">Masculino</option>
                          <option value="F">Feminino</option>
                        </Select>
                      </FormControl>
                    </Box>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Estado Civil</FormLabel>
                        <Select
                          placeholder="Selecione..."
                          value={form.estado_civil}
                          onChange={(e) => update('estado_civil', e.target.value)}
                          size="sm"
                        >
                          <option value="Solteiro(a)">Solteiro(a)</option>
                          <option value="Casado(a)">Casado(a)</option>
                          <option value="Divorciado(a)">Divorciado(a)</option>
                          <option value="Viúvo(a)">Viúvo(a)</option>
                          <option value="União Estável">União Estável</option>
                        </Select>
                      </FormControl>
                    </Box>
                  </Flex>
                  <FormControl>
                    <FormLabel fontSize="sm">Escolaridade</FormLabel>
                    <Select
                      placeholder="Selecione..."
                      value={form.escolaridade}
                      onChange={(e) => update('escolaridade', e.target.value)}
                      size="sm"
                    >
                      <option value="Fundamental Incompleto">Fundamental Incompleto</option>
                      <option value="Fundamental Completo">Fundamental Completo</option>
                      <option value="Médio Incompleto">Médio Incompleto</option>
                      <option value="Médio Completo">Médio Completo</option>
                      <option value="Superior Incompleto">Superior Incompleto</option>
                      <option value="Superior Completo">Superior Completo</option>
                      <option value="Pós-graduação">Pós-graduação</option>
                    </Select>
                  </FormControl>
                  <Flex gap={4}>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Nome do Pai</FormLabel>
                        <Input
                          value={form.nome_pai}
                          onChange={(e) => update('nome_pai', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Nome da Mãe</FormLabel>
                        <Input
                          value={form.nome_mae}
                          onChange={(e) => update('nome_mae', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                  </Flex>
                  <Flex gap={4}>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Nome do Cônjuge</FormLabel>
                        <Input
                          value={form.nome_conjuge}
                          onChange={(e) => update('nome_conjuge', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">CPF do Cônjuge</FormLabel>
                        <Input
                          placeholder="000.000.000-00"
                          value={form.cpf_conjuge}
                          onChange={(e) => update('cpf_conjuge', maskCpf(e.target.value))}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                  </Flex>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Card>

          <Card mb={4}>
            <AccordionItem border="none">
              <AccordionButton px={6} py={3}>
                <Box flex="1" textAlign="left">
                  <Heading size="sm">Contato</Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6} px={6}>
                <VStack spacing={4} align="stretch">
                  <Flex gap={4}>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Celular</FormLabel>
                        <Input
                          placeholder="(00) 00000-0000"
                          value={form.celular_cooperado}
                          onChange={(e) => update('celular_cooperado', maskPhone(e.target.value))}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Telefone Residencial</FormLabel>
                        <Input
                          placeholder="(00) 0000-0000"
                          value={form.telefone_residencial}
                          onChange={(e) => update('telefone_residencial', maskPhone(e.target.value))}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                  </Flex>
                  <FormControl>
                    <FormLabel fontSize="sm">Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="email@exemplo.com"
                      value={form.email_cooperado}
                      onChange={(e) => update('email_cooperado', e.target.value)}
                      size="sm"
                    />
                  </FormControl>
                  <Flex gap={4}>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Celular Indicador</FormLabel>
                        <Input
                          placeholder="(00) 00000-0000"
                          value={form.celular_indicador}
                          onChange={(e) => update('celular_indicador', maskPhone(e.target.value))}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Email Indicador</FormLabel>
                        <Input
                          type="email"
                          value={form.email_indicador}
                          onChange={(e) => update('email_indicador', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                  </Flex>
                  <Flex gap={4}>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Nome da Indicação</FormLabel>
                        <Input
                          value={form.nome_indicacao}
                          onChange={(e) => update('nome_indicacao', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Email do Gestor</FormLabel>
                        <Input
                          type="email"
                          value={form.email_gestor}
                          onChange={(e) => update('email_gestor', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                  </Flex>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Card>

          <Card mb={4}>
            <AccordionItem border="none">
              <AccordionButton px={6} py={3}>
                <Box flex="1" textAlign="left">
                  <Heading size="sm">Endereço</Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6} px={6}>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel fontSize="sm">Endereço</FormLabel>
                    <Input
                      placeholder="Rua, número..."
                      value={form.endereco}
                      onChange={(e) => update('endereco', e.target.value)}
                      size="sm"
                    />
                  </FormControl>
                  <Flex gap={4}>
                    <Box flex={2}>
                      <FormControl>
                        <FormLabel fontSize="sm">Bairro</FormLabel>
                        <Input
                          value={form.bairro}
                          onChange={(e) => update('bairro', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Complemento</FormLabel>
                        <Input
                          value={form.complemento}
                          onChange={(e) => update('complemento', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                  </Flex>
                  <Flex gap={4}>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">CEP</FormLabel>
                        <Input
                          placeholder="00000-000"
                          value={form.cep}
                          onChange={(e) => update('cep', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                    <Box flex={2}>
                      <FormControl>
                        <FormLabel fontSize="sm">Cidade</FormLabel>
                        <Input
                          value={form.cidade}
                          onChange={(e) => update('cidade', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Estado (UF)</FormLabel>
                        <Select
                          placeholder="Selecione..."
                          value={form.estado}
                          onChange={(e) => update('estado', e.target.value)}
                          size="sm"
                        >
                          {BRAZILIAN_STATES.map((state) => (
                            <option key={state.value} value={state.value}>
                              {state.label}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Flex>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Card>

          <Card mb={4}>
            <AccordionItem border="none">
              <AccordionButton px={6} py={3}>
                <Box flex="1" textAlign="left">
                  <Heading size="sm">Dados Profissionais</Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6} px={6}>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel fontSize="sm">Empresa de Trabalho</FormLabel>
                    <Input
                      value={form.empresa_trabalho}
                      onChange={(e) => update('empresa_trabalho', e.target.value)}
                      size="sm"
                    />
                  </FormControl>
                  <Flex gap={4}>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Cargo Pretendido</FormLabel>
                        <Input
                          value={form.cargo_pretendido}
                          onChange={(e) => update('cargo_pretendido', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Cargo Contratado</FormLabel>
                        <Input
                          value={form.cargo_contratado}
                          onChange={(e) => update('cargo_contratado', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                  </Flex>
                  <Flex gap={4}>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Salário</FormLabel>
                        <Input
                          placeholder="R$ 0,00"
                          value={form.salario}
                          onChange={(e) => update('salario', maskCurrency(e.target.value))}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Data de Admissão</FormLabel>
                        <Input
                          type="date"
                          value={form.data_admissao}
                          onChange={(e) => update('data_admissao', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Data de Cadastro</FormLabel>
                        <Input
                          type="date"
                          value={form.data_cadastro}
                          onChange={(e) => update('data_cadastro', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                  </Flex>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Card>

          <Card mb={4}>
            <AccordionItem border="none">
              <AccordionButton px={6} py={3}>
                <Box flex="1" textAlign="left">
                  <Heading size="sm">Atividades</Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6} px={6}>
                <VStack spacing={4} align="stretch">
                  <ActivityCheckboxGroup
                    label="Atividade Cooperado - 01"
                    value={form.ativ_coop_dropa}
                    onChange={(v) => update('ativ_coop_dropa', v || '')}
                  />
                  <ActivityCheckboxGroup
                    label="Atividade Cooperado - 02"
                    value={form.ativ_coop_dropb}
                    onChange={(v) => update('ativ_coop_dropb', v || '')}
                  />
                  <ActivityCheckboxGroup
                    label="Atividade Cooperado - 03"
                    value={form.atividades_cooperados}
                    onChange={(v) => update('atividades_cooperados', v || '')}
                  />
                  <FormControl>
                    <FormLabel fontSize="sm">Outras Atividades Profissionais</FormLabel>
                    <Textarea
                      value={form.outras_ativd_profissionais}
                      onChange={(e) => update('outras_ativd_profissionais', e.target.value)}
                      size="sm"
                      rows={2}
                    />
                  </FormControl>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Card>

          <Card mb={4}>
            <AccordionItem border="none">
              <AccordionButton px={6} py={3}>
                <Box flex="1" textAlign="left">
                  <Heading size="sm">Dados Bancários</Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6} px={6}>
                <VStack spacing={4} align="stretch">
                  <Flex gap={4}>
                    <Box flex={2}>
                      <FormControl>
                        <FormLabel fontSize="sm">Banco</FormLabel>
                        <Input
                          value={form.banco}
                          onChange={(e) => update('banco', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Agência</FormLabel>
                        <Input
                          value={form.agencia}
                          onChange={(e) => update('agencia', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                  </Flex>
                  <Flex gap={4}>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Conta Corrente</FormLabel>
                        <Input
                          value={form.conta_corrente}
                          onChange={(e) => update('conta_corrente', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Chave PIX</FormLabel>
                        <Input
                          value={form.pix}
                          onChange={(e) => update('pix', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                  </Flex>
                  <FormControl>
                    <FormLabel fontSize="sm">Capital Social</FormLabel>
                    <Input
                      placeholder="R$ 0,00"
                      value={form.capital_social}
                      onChange={(e) => update('capital_social', maskCurrency(e.target.value))}
                      size="sm"
                    />
                  </FormControl>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Card>

          <Card mb={4}>
            <AccordionItem border="none">
              <AccordionButton px={6} py={3}>
                <Box flex="1" textAlign="left">
                  <Heading size="sm">Documentos e Checklist</Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6} px={6}>
                <VStack spacing={4} align="stretch">
                  <DocumentCheckboxGroup
                    label="Documentos"
                    value={form.documentos}
                    onChange={(v) => update('documentos', v || '')}
                  />
                  <FormControl>
                    <FormLabel fontSize="sm">Descrição Sucinta</FormLabel>
                    <Textarea
                      value={form.descricao_sucinta}
                      onChange={(e) => update('descricao_sucinta', e.target.value)}
                      size="sm"
                      rows={2}
                    />
                  </FormControl>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Card>

          <Card mb={4}>
            <AccordionItem border="none">
              <AccordionButton px={6} py={3}>
                <Box flex="1" textAlign="left">
                  <Heading size="sm">Valores</Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6} px={6}>
                <VStack spacing={4} align="stretch">
                  <Flex gap={4}>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Valor Acumulado</FormLabel>
                        <Input
                          placeholder="R$ 0,00"
                          value={form.valor_acumulado}
                          onChange={(e) => update('valor_acumulado', maskCurrency(e.target.value))}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Valor Atual</FormLabel>
                        <Input
                          placeholder="R$ 0,00"
                          value={form.valor_atual}
                          onChange={(e) => update('valor_atual', maskCurrency(e.target.value))}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                  </Flex>
                  <Flex gap={4}>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Valor Integralizado</FormLabel>
                        <Input
                          placeholder="R$ 0,00"
                          value={form.valor_integralizado}
                          onChange={(e) => update('valor_integralizado', maskCurrency(e.target.value))}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Valor VAR</FormLabel>
                        <Input
                          placeholder="R$ 0,00"
                          value={form.valor_var}
                          onChange={(e) => update('valor_var', maskCurrency(e.target.value))}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                  </Flex>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Card>

          <Card mb={4}>
            <AccordionItem border="none">
              <AccordionButton px={6} py={3}>
                <Box flex="1" textAlign="left">
                  <Heading size="sm">Outros</Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6} px={6}>
                <VStack spacing={4} align="stretch">
                  <Flex gap={4}>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Parcelas</FormLabel>
                        <Input
                          value={form.parcelas}
                          onChange={(e) => update('parcelas', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Em Aberto</FormLabel>
                        <Input
                          value={form.em_aberto}
                          onChange={(e) => update('em_aberto', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                  </Flex>
                  <Flex gap={4}>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Local de Cadastro</FormLabel>
                        <Input
                          value={form.local_cadastro}
                          onChange={(e) => update('local_cadastro', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Matrícula</FormLabel>
                        <Input
                          value={form.matricula}
                          onChange={(e) => update('matricula', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                  </Flex>
                  <Flex gap={4}>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">1º Venc. Cooperados</FormLabel>
                        <Input
                          value={form.venc_cooperados}
                          onChange={(e) => update('venc_cooperados', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel fontSize="sm">Slug</FormLabel>
                        <Input
                          value={form.slug}
                          onChange={(e) => update('slug', e.target.value)}
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                  </Flex>
                  <FormControl>
                    <FormLabel fontSize="sm">Imagem (URL)</FormLabel>
                    <Input
                      placeholder="URL da imagem"
                      value={form.imagem_cooperado}
                      onChange={(e) => update('imagem_cooperado', e.target.value)}
                      size="sm"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Status</FormLabel>
                    <Select
                      value={form.status}
                      onChange={(e) => update('status', e.target.value)}
                      size="sm"
                    >
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                    </Select>
                  </FormControl>
                  <Box
                    p={4}
                    bg="gray.50"
                    borderRadius="md"
                    border="1px dashed"
                    borderColor="gray.300"
                  >
                    <FormLabel fontSize="sm" fontWeight="bold">Declaração de Adesão (PDF)</FormLabel>
                    {declaracaoUrl ? (
                      <VStack align="start" spacing={2}>
                        <Badge colorScheme="green">Arquivo enviado</Badge>
                        <HStack spacing={2}>
                          <Button
                            size="xs"
                            colorScheme="blue"
                            variant="outline"
                            onClick={() => window.open(declaracaoUrl, '_blank')}
                          >
                            Visualizar
                          </Button>
                          <Button
                            size="xs"
                            colorScheme="blue"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = declaracaoUrl;
                              link.download = `declaracao-adesao-${form.nome_cooperado || id}.pdf`;
                              link.click();
                            }}
                          >
                            Baixar
                          </Button>
                        </HStack>
                      </VStack>
                    ) : (
                      <Text fontSize="sm" color="text.subtle" mb={2}>
                        Nenhum arquivo enviado.
                      </Text>
                    )}
                    <input
                      type="file"
                      accept=".pdf"
                      ref={declaracaoFileRef}
                      style={{ display: 'none' }}
                      onChange={handleDeclaracaoUpload}
                    />
                    <Button
                      size="sm"
                      colorScheme="brand"
                      variant="outline"
                      mt={2}
                      onClick={() => declaracaoFileRef.current?.click()}
                      isLoading={uploadingDeclaracao}
                    >
                      {declaracaoUrl ? 'Substituir PDF' : 'Enviar PDF'}
                    </Button>
                  </Box>
                  <Box
                    p={4}
                    bg="gray.50"
                    borderRadius="md"
                    border="1px dashed"
                    borderColor="gray.300"
                  >
                    <FormLabel fontSize="sm" fontWeight="bold">Recibo de Contribuição (PDF)</FormLabel>
                    {reciboUrl ? (
                      <VStack align="start" spacing={2}>
                        <Badge colorScheme="green">Arquivo enviado</Badge>
                        <HStack spacing={2}>
                          <Button
                            size="xs"
                            colorScheme="blue"
                            variant="outline"
                            onClick={() => window.open(reciboUrl, '_blank')}
                          >
                            Visualizar
                          </Button>
                          <Button
                            size="xs"
                            colorScheme="blue"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = reciboUrl;
                              link.download = `recibo-contribuicao-${form.nome_cooperado || id}.pdf`;
                              link.click();
                            }}
                          >
                            Baixar
                          </Button>
                        </HStack>
                      </VStack>
                    ) : (
                      <Text fontSize="sm" color="text.subtle" mb={2}>
                        Nenhum arquivo enviado.
                      </Text>
                    )}
                    <input
                      type="file"
                      accept=".pdf"
                      ref={reciboFileRef}
                      style={{ display: 'none' }}
                      onChange={handleReciboUpload}
                    />
                    <Button
                      size="sm"
                      colorScheme="brand"
                      variant="outline"
                      mt={2}
                      onClick={() => reciboFileRef.current?.click()}
                      isLoading={uploadingRecibo}
                    >
                      {reciboUrl ? 'Substituir PDF' : 'Enviar PDF'}
                    </Button>
                  </Box>
                  <Box
                    p={4}
                    bg="gray.50"
                    borderRadius="md"
                    border="1px dashed"
                    borderColor="gray.300"
                  >
                    <FormLabel fontSize="sm" fontWeight="bold">Declaração de Quitação (PDF)</FormLabel>
                    <Text fontSize="xs" color="text.subtle" mb={2}>
                      Comprovante de que o cooperado não possui dívidas financeiras com a cooperativa.
                    </Text>
                    {quitacaoUrl ? (
                      <VStack align="start" spacing={2}>
                        <Badge colorScheme="green">Arquivo enviado</Badge>
                        <HStack spacing={2}>
                          <Button
                            size="xs"
                            colorScheme="blue"
                            variant="outline"
                            onClick={() => window.open(quitacaoUrl, '_blank')}
                          >
                            Visualizar
                          </Button>
                          <Button
                            size="xs"
                            colorScheme="blue"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = quitacaoUrl;
                              link.download = `declaracao-quitacao-${form.nome_cooperado || id}.pdf`;
                              link.click();
                            }}
                          >
                            Baixar
                          </Button>
                        </HStack>
                      </VStack>
                    ) : (
                      <Text fontSize="sm" color="text.subtle" mb={2}>
                        Nenhum arquivo enviado.
                      </Text>
                    )}
                    <input
                      type="file"
                      accept=".pdf"
                      ref={quitacaoFileRef}
                      style={{ display: 'none' }}
                      onChange={handleQuitacaoUpload}
                    />
                    <Button
                      size="sm"
                      colorScheme="brand"
                      variant="outline"
                      mt={2}
                      onClick={() => quitacaoFileRef.current?.click()}
                      isLoading={uploadingQuitacao}
                    >
                      {quitacaoUrl ? 'Substituir PDF' : 'Enviar PDF'}
                    </Button>
                  </Box>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Card>
        </Accordion>

        <Flex justifyContent="flex-end" mt={6} mb={8}>
          <HStack spacing={3}>
            <Link href={`/cooperados/${id}`}>
              <Button variant="ghost">Cancelar</Button>
            </Link>
            <Button
              colorScheme="brand"
              leftIcon={<HiCheck />}
              onClick={handleSave}
              isLoading={updateCooperado.isPending}
              size="lg"
            >
              Salvar Alterações
            </Button>
          </HStack>
        </Flex>
      </Box>
    </MainLayout>
  );
}
