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
} from '@chakra-ui/react';
import { HiArrowLeft, HiCheck, HiUser } from 'react-icons/hi2';
import { MainLayout, CreatableSelect } from '@/components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewCollaboratorPage() {
  const router = useRouter();
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [cargo, setCargo] = useState('');
  const [tipoContrato, setTipoContrato] = useState('');
  const [regimeTrabalho, setRegimeTrabalho] = useState('');

  const cargoOptions = [
    { label: 'Enfermeiro(a)', value: 'enfermeiro' },
    { label: 'Técnico(a) de Enfermagem', value: 'tecnico_enfermagem' },
    { label: 'Auxiliar de Enfermagem', value: 'auxiliar_enfermagem' },
    { label: 'Médico(a)', value: 'medico' },
    { label: 'Fisioterapeuta', value: 'fisioterapeuta' },
    { label: 'Nutricionista', value: 'nutricionista' },
    { label: 'Psicólogo(a)', value: 'psicologo' },
    { label: 'Assistente Social', value: 'assistente_social' },
    { label: 'Farmacêutico(a)', value: 'farmaceutico' },
    { label: 'Fonoaudiólogo(a)', value: 'fonoaudiologo' },
    { label: 'Terapeuta Ocupacional', value: 'terapeuta_ocupacional' },
    { label: 'Radiologista', value: 'radiologista' },
    { label: 'Técnico de Radiologia', value: 'tecnico_radiologia' },
    { label: 'Laboratorista', value: 'laboratorista' },
    { label: 'Técnico de Laboratório', value: 'tecnico_laboratorio' },
    { label: 'Dentista', value: 'dentista' },
    { label: 'Técnico de Odontologia', value: 'tecnico_odontologia' },
    { label: 'Artesão', value: 'artesa' },
    { label: 'Copeiro(a)', value: 'copeiro' },
    { label: 'Auxiliar de Serviços Gerais', value: 'auxiliar_servicos_gerais' },
    { label: 'Recepcionista', value: 'recepcionista' },
    { label: 'Administrador', value: 'administrador' },
    { label: 'Contador(a)', value: 'contador' },
    { label: 'Analista de RH', value: 'analista_rh' },
    { label: 'Assistente Administrativo', value: 'assistente_administrativo' },
    { label: 'Vigilante', value: 'vigilante' },
    { label: 'Segurança', value: 'seguranca' },
    { label: 'Motorista', value: 'motorista' },
    { label: 'Cozinheiro(a)', value: 'cozinheiro' },
    { label: 'Jardineiro(a)', value: 'jardineiro' },
    { label: 'Eletricista', value: 'eletricista' },
    { label: 'Encanador', value: 'encanador' },
    { label: 'Marceneiro', value: 'marceneiro' },
  ];

  const tipoContratoOptions = [
    { label: 'CLT', value: 'clt' },
    { label: 'PJ', value: 'pj' },
    { label: 'Estatutário', value: 'estatuario' },
    { label: 'Temporário', value: 'temporario' },
    { label: 'Estágio', value: 'estagio' },
    { label: 'Cooperado', value: 'cooperado' },
    { label: 'Autônomo', value: 'autonomo' },
  ];

  const regimeTrabalhoOptions = [
    { label: 'Hospitalar', value: 'hospitalar' },
    { label: 'SAD (Atendimento Domiciliar)', value: 'sad' },
    { label: 'Ambos', value: 'ambos' },
    { label: 'Administrativo', value: 'administrativo' },
    { label: 'Ambulatorial', value: 'ambulatorial' },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: 'Colaborador criado',
        description: 'O cadastro foi realizado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.push('/collaborators');
    }, 1500);
  };

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
                Novo Colaborador
              </Heading>
              <Text color="text.secondary" mt={1}>
                Preencha os dados para cadastrar um novo cooperado
              </Text>
            </Box>
          </HStack>
          <HStack spacing={3}>
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
              </TabList>

              <TabPanels>
                <TabPanel p={0}>
                  <VStack spacing={6} align="stretch">
                    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Nome Completo</FormLabel>
                          <Input placeholder="Digite o nome completo" />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>CPF</FormLabel>
                          <Input placeholder="000.000.000-00" />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>RG</FormLabel>
                          <Input placeholder="00.000.000-0" />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Data de Nascimento</FormLabel>
                          <Input type="date" />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Sexo</FormLabel>
                          <Select placeholder="Selecione">
                            <option value="M">Masculino</option>
                            <option value="F">Feminino</option>
                          </Select>
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Estado Civil</FormLabel>
                          <Select placeholder="Selecione">
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
                          <Input placeholder="(00) 00000-0000" />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Email</FormLabel>
                          <Input type="email" placeholder="email@exemplo.com" />
                        </FormControl>
                      </GridItem>
                      <GridItem colSpan={2}>
                        <FormControl isRequired>
                          <FormLabel>Endereço Completo</FormLabel>
                          <Input placeholder="Rua, número, bairro, cidade - UF" />
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
                          <Input placeholder="Número da matrícula" />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Data de Admissão</FormLabel>
                          <Input type="date" />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <CreatableSelect
                          label="Cargo"
                          options={cargoOptions}
                          value={cargo}
                          onChange={setCargo}
                          isRequired
                        />
                      </GridItem>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Salário Base (R$)</FormLabel>
                          <Input type="number" placeholder="0,00" />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <CreatableSelect
                          label="Tipo de Contrato"
                          options={tipoContratoOptions}
                          value={tipoContrato}
                          onChange={setTipoContrato}
                          isRequired
                        />
                      </GridItem>
                      <GridItem>
                        <CreatableSelect
                          label="Regime de Trabalho"
                          options={regimeTrabalhoOptions}
                          value={regimeTrabalho}
                          onChange={setRegimeTrabalho}
                          isRequired
                        />
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
                            <Input placeholder="Nome do banco" />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Agência</FormLabel>
                            <Input placeholder="0000-0" />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Conta</FormLabel>
                            <Input placeholder="00000-0" />
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
                            <Input placeholder="Ex: Enfermagem" />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Atividade Secundária (Coop DropB)</FormLabel>
                            <Input placeholder="Ex: Auxiliar Administrativo" />
                          </FormControl>
                        </GridItem>
                        <GridItem colSpan={2}>
                          <FormControl>
                            <FormLabel>Outras Atividades</FormLabel>
                            <Input placeholder="Separar por vírgula" />
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

                <TabPanel p={0}>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Heading size="sm" mb={4} color="text.subtle">
                        Documentos Necessários
                      </Heading>
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <GridItem>
                          <FormControl>
                            <FormLabel>RG (Frente)</FormLabel>
                            <Input type="file" accept="image/*,.pdf" />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>RG (Verso)</FormLabel>
                            <Input type="file" accept="image/*,.pdf" />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>CPF</FormLabel>
                            <Input type="file" accept="image/*,.pdf" />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Comprovante de Endereço</FormLabel>
                            <Input type="file" accept="image/*,.pdf" />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Carteira de Trabalho</FormLabel>
                            <Input type="file" accept="image/*,.pdf" />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>ASO (Atestado de Saúde Ocupacional)</FormLabel>
                            <Input type="file" accept="image/*,.pdf" />
                          </FormControl>
                        </GridItem>
                      </Grid>
                    </Box>

                    <Divider />

                    <Box>
                      <Heading size="sm" mb={4} color="text.subtle">
                        Assinatura
                      </Heading>
                      <FormControl>
                        <FormLabel>Assinatura Digital</FormLabel>
                        <Input placeholder="URL da assinatura ou assine digitalmente" />
                      </FormControl>
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
