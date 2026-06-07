'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
} from '@chakra-ui/react';
import { HiArrowLeft, HiCheck } from 'react-icons/hi2';
import { MainLayout } from '@/components';
import { useCreateCooperado } from '@/hooks';
import Link from 'next/link';

const initialForm = {
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
  status: 'active',
};

export default function NewCooperadoPage() {
  const router = useRouter();
  const createCooperado = useCreateCooperado();
  const toast = useToast();
  const [form, setForm] = useState(initialForm);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleCreate = async () => {
    if (!form.nome_cooperado.trim()) {
      toast({
        title: 'Nome obrigatório',
        description: 'Preencha o nome do cooperado.',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    try {
      await createCooperado.mutateAsync(form);
      toast({
        title: 'Cooperado criado',
        description: 'Novo cooperado adicionado com sucesso.',
        status: 'success',
        duration: 3000,
      });
      router.push('/cooperados');
    } catch (error: any) {
      toast({
        title: 'Erro ao criar cooperado',
        description: error?.response?.data?.message || 'Tente novamente.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const InputField = ({
    label,
    field,
    placeholder,
    type = 'text',
  }: {
    label: string;
    field: string;
    placeholder?: string;
    type?: string;
  }) => (
    <FormControl>
      <FormLabel fontSize="sm">{label}</FormLabel>
      <Input
        type={type}
        placeholder={placeholder || label}
        value={(form as any)[field] || ''}
        onChange={(e) => update(field, e.target.value)}
        size="sm"
      />
    </FormControl>
  );

  const SelectField = ({
    label,
    field,
    options,
  }: {
    label: string;
    field: string;
    options: { value: string; label: string }[];
  }) => (
    <FormControl>
      <FormLabel fontSize="sm">{label}</FormLabel>
      <Select
        placeholder={`Selecione...`}
        value={(form as any)[field] || ''}
        onChange={(e) => update(field, e.target.value)}
        size="sm"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>
    </FormControl>
  );

  const TextareaField = ({
    label,
    field,
    placeholder,
  }: {
    label: string;
    field: string;
    placeholder?: string;
  }) => (
    <FormControl>
      <FormLabel fontSize="sm">{label}</FormLabel>
      <Textarea
        placeholder={placeholder || label}
        value={(form as any)[field] || ''}
        onChange={(e) => update(field, e.target.value)}
        size="sm"
        rows={2}
      />
    </FormControl>
  );

  return (
    <MainLayout>
      <Box maxW="900px" mx="auto">
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Box>
            <Heading size="lg" color="text.primary">
              Novo Cooperado
            </Heading>
            <Text color="text.secondary">
              Preencha os dados do cooperado
            </Text>
          </Box>
          <HStack spacing={3}>
            <Link href="/cooperados">
              <Button leftIcon={<HiArrowLeft />} variant="ghost">
                Voltar
              </Button>
            </Link>
            <Button
              colorScheme="brand"
              leftIcon={<HiCheck />}
              onClick={handleCreate}
              isLoading={createCooperado.isPending}
            >
              Salvar
            </Button>
          </HStack>
        </Flex>

        <Accordion defaultIndex={[0]} allowMultiple>
          {/* Dados Pessoais */}
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
                      <InputField label="CPF" field="cpf_cooperado" placeholder="000.000.000-00" />
                    </Box>
                    <Box flex={1}>
                      <InputField label="RG" field="rg" />
                    </Box>
                  </Flex>
                  <Flex gap={4}>
                    <Box flex={1}>
                      <InputField label="NIS/PIS" field="nis_pis" />
                    </Box>
                    <Box flex={1}>
                      <InputField label="CTPS/Série" field="ctps_serie" />
                    </Box>
                  </Flex>
                  <Flex gap={4}>
                    <Box flex={1}>
                      <InputField label="Nacionalidade" field="nacionalidade" />
                    </Box>
                    <Box flex={1}>
                      <InputField label="Naturalidade" field="naturalidade" />
                    </Box>
                  </Flex>
                  <Flex gap={4}>
                    <Box flex={1}>
                      <InputField label="Data de Nascimento" field="nascimento" type="date" />
                    </Box>
                    <Box flex={1}>
                      <SelectField
                        label="Sexo"
                        field="sexo"
                        options={[
                          { value: 'M', label: 'Masculino' },
                          { value: 'F', label: 'Feminino' },
                        ]}
                      />
                    </Box>
                    <Box flex={1}>
                      <SelectField
                        label="Estado Civil"
                        field="estado_civil"
                        options={[
                          { value: 'Solteiro(a)', label: 'Solteiro(a)' },
                          { value: 'Casado(a)', label: 'Casado(a)' },
                          { value: 'Divorciado(a)', label: 'Divorciado(a)' },
                          { value: 'Viúvo(a)', label: 'Viúvo(a)' },
                          { value: 'União Estável', label: 'União Estável' },
                        ]}
                      />
                    </Box>
                  </Flex>
                  <FormControl>
                    <FormLabel fontSize="sm">Escolaridade</FormLabel>
                    <Select
                      placeholder="Selecione..."
                      value={form.escolaridade || ''}
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
                      <InputField label="Nome do Pai" field="nome_pai" />
                    </Box>
                    <Box flex={1}>
                      <InputField label="Nome da Mãe" field="nome_mae" />
                    </Box>
                  </Flex>
                  <Flex gap={4}>
                    <Box flex={1}>
                      <InputField label="Nome do Cônjuge" field="nome_conjuge" />
                    </Box>
                    <Box flex={1}>
                      <InputField label="CPF do Cônjuge" field="cpf_conjuge" placeholder="000.000.000-00" />
                    </Box>
                  </Flex>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Card>

          {/* Contato */}
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
                      <InputField label="Celular" field="celular_cooperado" placeholder="(00) 00000-0000" />
                    </Box>
                    <Box flex={1}>
                      <InputField label="Telefone Residencial" field="telefone_residencial" placeholder="(00) 0000-0000" />
                    </Box>
                  </Flex>
                  <InputField label="Email" field="email_cooperado" placeholder="email@exemplo.com" type="email" />
                  <Flex gap={4}>
                    <Box flex={1}>
                      <InputField label="Celular Indicador" field="celular_indicador" placeholder="(00) 00000-0000" />
                    </Box>
                    <Box flex={1}>
                      <InputField label="Email Indicador" field="email_indicador" type="email" />
                    </Box>
                  </Flex>
                  <Flex gap={4}>
                    <Box flex={1}>
                      <InputField label="Nome da Indicação" field="nome_indicacao" />
                    </Box>
                    <Box flex={1}>
                      <InputField label="Email do Gestor" field="email_gestor" type="email" />
                    </Box>
                  </Flex>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Card>

          {/* Endereço */}
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
                  <InputField label="Endereço" field="endereco" placeholder="Rua, número..." />
                  <Flex gap={4}>
                    <Box flex={2}>
                      <InputField label="Bairro" field="bairro" />
                    </Box>
                    <Box flex={1}>
                      <InputField label="Complemento" field="complemento" />
                    </Box>
                  </Flex>
                  <Flex gap={4}>
                    <Box flex={1}>
                      <InputField label="CEP" field="cep" placeholder="00000-000" />
                    </Box>
                    <Box flex={2}>
                      <InputField label="Cidade" field="cidade" />
                    </Box>
                    <Box flex={1}>
                      <InputField label="Estado" field="estado" placeholder="UF" />
                    </Box>
                  </Flex>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Card>

          {/* Dados Profissionais */}
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
                  <InputField label="Empresa de Trabalho" field="empresa_trabalho" />
                  <Flex gap={4}>
                    <Box flex={1}>
                      <InputField label="Cargo Pretendido" field="cargo_pretendido" />
                    </Box>
                    <Box flex={1}>
                      <InputField label="Cargo Contratado" field="cargo_contratado" />
                    </Box>
                  </Flex>
                  <Flex gap={4}>
                    <Box flex={1}>
                      <InputField label="Salário" field="salario" placeholder="0,00" />
                    </Box>
                    <Box flex={1}>
                      <InputField label="Data de Admissão" field="data_admissao" type="date" />
                    </Box>
                    <Box flex={1}>
                      <InputField label="Data de Cadastro" field="data_cadastro" type="date" />
                    </Box>
                  </Flex>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Card>

          {/* Atividades */}
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
                  <InputField label="Ativ. Coop. Dropa" field="ativ_coop_dropa" />
                  <InputField label="Ativ. Coop. Dropb" field="ativ_coop_dropb" />
                  <TextareaField label="Atividades do Cooperado" field="atividades_cooperados" />
                  <TextareaField label="Outras Atividades Profissionais" field="outras_ativd_profissionais" />
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Card>

          {/* Dados Bancários */}
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
                      <InputField label="Banco" field="banco" />
                    </Box>
                    <Box flex={1}>
                      <InputField label="Agência" field="agencia" />
                    </Box>
                  </Flex>
                  <Flex gap={4}>
                    <Box flex={1}>
                      <InputField label="Conta Corrente" field="conta_corrente" />
                    </Box>
                    <Box flex={1}>
                      <InputField label="PIX" field="pix" />
                    </Box>
                  </Flex>
                  <InputField label="Capital Social" field="capital_social" />
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Card>

          {/* Documentos e Checklist */}
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
                  <InputField label="Carteira de Registro" field="carteira_registro" />
                  <InputField label="Atestados Técnicos" field="atestados_tecnicos" />
                  <InputField label="Currículo Profissional" field="curriculo_profissional" />
                  <TextareaField label="Descrição Sucinta" field="descricao_sucinta" />
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Card>

          {/* Valores */}
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
                      <InputField label="Valor Acumulado" field="valor_acumulado" />
                    </Box>
                    <Box flex={1}>
                      <InputField label="Valor Atual" field="valor_atual" />
                    </Box>
                  </Flex>
                  <Flex gap={4}>
                    <Box flex={1}>
                      <InputField label="Valor Integralizado" field="valor_integralizado" />
                    </Box>
                    <Box flex={1}>
                      <InputField label="Valor VAR" field="valor_var" />
                    </Box>
                  </Flex>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Card>

          {/* Outros */}
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
                      <InputField label="Parcelas" field="parcelas" />
                    </Box>
                    <Box flex={1}>
                      <InputField label="Em Aberto" field="em_aberto" />
                    </Box>
                  </Flex>
                  <Flex gap={4}>
                    <Box flex={1}>
                      <InputField label="Local de Cadastro" field="local_cadastro" />
                    </Box>
                    <Box flex={1}>
                      <InputField label="Matrícula" field="matricula" />
                    </Box>
                  </Flex>
                  <Flex gap={4}>
                    <Box flex={1}>
                      <InputField label="1º Venc. Cooperados" field="venc_cooperados" />
                    </Box>
                    <Box flex={1}>
                      <InputField label="Slug" field="slug" />
                    </Box>
                  </Flex>
                  <InputField label="Imagem (URL)" field="imagem_cooperado" placeholder="URL da imagem" />
                  <TextareaField label="Descrição Sucinta" field="descricao_sucinta" />
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Card>
        </Accordion>

        <Flex justifyContent="flex-end" mt={6} mb={8}>
          <HStack spacing={3}>
            <Link href="/cooperados">
              <Button variant="ghost">Cancelar</Button>
            </Link>
            <Button
              colorScheme="brand"
              leftIcon={<HiCheck />}
              onClick={handleCreate}
              isLoading={createCooperado.isPending}
              size="lg"
            >
              Salvar Cooperado
            </Button>
          </HStack>
        </Flex>
      </Box>
    </MainLayout>
  );
}
