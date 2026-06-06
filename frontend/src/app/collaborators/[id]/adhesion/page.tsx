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
  Checkbox,
  Textarea,
} from '@chakra-ui/react';
import { HiArrowLeft, HiCheck, HiDocumentText } from 'react-icons/hi2';
import { MainLayout } from '@/components';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';

export default function AdhesionFormPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: 'Formulário de adesão salvo',
        description: 'O formulário foi registrado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.push(`/collaborators/${params.id}`);
    }, 1500);
  };

  return (
    <MainLayout>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <HStack spacing={4}>
            <Link href={`/collaborators/${params.id}`}>
              <IconButton
                aria-label="Voltar"
                icon={<HiArrowLeft />}
                variant="ghost"
              />
            </Link>
            <Box>
              <Heading size="lg" color="text.primary">
                Formulário de Adesão
              </Heading>
              <Text color="text.secondary" mt={1}>
                Documento de adesão do cooperado à empresa
              </Text>
            </Box>
            <Badge colorScheme="blue">Pendente</Badge>
          </HStack>
          <HStack spacing={3}>
            <Button variant="outline" onClick={() => router.push(`/collaborators/${params.id}`)}>
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
                <Tab>Dados do Cooperado</Tab>
                <Tab>Atividades</Tab>
                <Tab>Documentos</Tab>
                <Tab>Assinatura</Tab>
              </TabList>

              <TabPanels>
                <TabPanel p={0}>
                  <VStack spacing={6} align="stretch">
                    <Box p={4} bg="blue.50" borderRadius="md">
                      <HStack>
                        <Icon as={HiDocumentText} color="blue.500" />
                        <Text fontWeight="600" color="blue.700">
                          Formulário de Adesão - Cooperativa Hospitalar
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color="blue.600" mt={2}>
                        Preencha todos os dados obrigatórios do cooperado para gerar o formulário de adesão.
                      </Text>
                    </Box>

                    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                      <GridItem colSpan={2}>
                        <FormControl isRequired>
                          <FormLabel>Nome Completo do Cooperado</FormLabel>
                          <Input placeholder="Nome completo conforme documento" />
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
                          <FormLabel>Órgão Emissor</FormLabel>
                          <Input placeholder="SSP/PA" />
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
                          <FormLabel>Naturalidade</FormLabel>
                          <Input placeholder="Belém/PA" />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Nacionalidade</FormLabel>
                          <Input defaultValue="Brasileira" />
                        </FormControl>
                      </GridItem>
                      <GridItem colSpan={2}>
                        <FormControl isRequired>
                          <FormLabel>Endereço Completo</FormLabel>
                          <Input placeholder="Rua, número, bairro, cidade - UF, CEP" />
                        </FormControl>
                      </GridItem>
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
                    </Grid>

                    <Divider />

                    <Box>
                      <Heading size="sm" mb={4} color="text.subtle">
                        Dados Profissionais
                      </Heading>
                      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                        <GridItem>
                          <FormControl isRequired>
                            <FormLabel>CTPS (Série)</FormLabel>
                            <Input placeholder="0000000-0" />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl isRequired>
                            <FormLabel>PIS/PASEP</FormLabel>
                            <Input placeholder="000.00000.00-0" />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl isRequired>
                            <FormLabel>Título de Eleitor</FormLabel>
                            <Input placeholder="0000.0000.0000" />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl isRequired>
                            <FormLabel>Certificado de Reservista</FormLabel>
                            <Input placeholder="000.000.000-0" />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl isRequired>
                            <FormLabel>CNH</FormLabel>
                            <Input placeholder="00000000000" />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl isRequired>
                            <FormLabel>Formação Acadêmica</FormLabel>
                            <Select placeholder="Selecione">
                              <option value="ensino_medio">Ensino Médio</option>
                              <option value="tecnico">Técnico</option>
                              <option value="superior">Superior</option>
                              <option value="pos_graduacao">Pós-Graduação</option>
                              <option value="mestrado">Mestrado</option>
                              <option value="doutorado">Doutorado</option>
                            </Select>
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
                        Atividades Desempenhadas
                      </Heading>
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <GridItem>
                          <FormControl isRequired>
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
                            <FormLabel>Outras Atividades (JSON)</FormLabel>
                            <Textarea
                              placeholder='["UTI", "Emergência", "Centro Cirúrgico"]'
                              h="100px"
                            />
                          </FormControl>
                        </GridItem>
                      </Grid>
                    </Box>

                    <Divider />

                    <Box>
                      <Heading size="sm" mb={4} color="text.subtle">
                        Locais de Trabalho
                      </Heading>
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <GridItem>
                          <FormControl isRequired>
                            <FormLabel>Unidade Principal</FormLabel>
                            <Input placeholder="Nome da unidade" />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Unidade Secundária</FormLabel>
                            <Input placeholder="Nome da unidade" />
                          </FormControl>
                        </GridItem>
                        <GridItem colSpan={2}>
                          <FormControl>
                            <FormLabel>Observações</FormLabel>
                            <Textarea placeholder="Informações adicionais sobre as atividades" />
                          </FormControl>
                        </GridItem>
                      </Grid>
                    </Box>

                    <Divider />

                    <Box>
                      <Heading size="sm" mb={4} color="text.subtle">
                        Remuneração
                      </Heading>
                      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                        <GridItem>
                          <FormControl isRequired>
                            <FormLabel>Valor da Hora (R$)</FormLabel>
                            <Input type="number" placeholder="0,00" />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl isRequired>
                            <FormLabel>Regime de Trabalho</FormLabel>
                            <Select placeholder="Selecione">
                              <option value="hospitalar">Hospitalar</option>
                              <option value="sad">SAD</option>
                              <option value="ambos">Ambos</option>
                            </Select>
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Adicionais</FormLabel>
                            <Input placeholder="Ex: Insalubridade, Periculosidade" />
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
                        Documentos Obrigatórios
                      </Heading>
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <GridItem>
                          <FormControl>
                            <FormLabel>RG (Frente e Verso)</FormLabel>
                            <Input type="file" accept="image/*,.pdf" multiple />
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
                            <FormLabel>CTPS (Frente e Verso)</FormLabel>
                            <Input type="file" accept="image/*,.pdf" multiple />
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
                            <FormLabel>ASO (Atestado de Saúde Ocupacional)</FormLabel>
                            <Input type="file" accept="image/*,.pdf" />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Certificado de Reservista (se aplicável)</FormLabel>
                            <Input type="file" accept="image/*,.pdf" />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Título de Eleitor</FormLabel>
                            <Input type="file" accept="image/*,.pdf" />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>PIS/PASEP</FormLabel>
                            <Input type="file" accept="image/*,.pdf" />
                          </FormControl>
                        </GridItem>
                      </Grid>
                    </Box>

                    <Divider />

                    <Box>
                      <Heading size="sm" mb={4} color="text.subtle">
                        Certidões
                      </Heading>
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Certidão de Nascimento ou Casamento</FormLabel>
                            <Input type="file" accept="image/*,.pdf" />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Certidão de Nascimento dos Dependentes</FormLabel>
                            <Input type="file" accept="image/*,.pdf" multiple />
                          </FormControl>
                        </GridItem>
                      </Grid>
                    </Box>
                  </VStack>
                </TabPanel>

                <TabPanel p={0}>
                  <VStack spacing={6} align="stretch">
                    <Box p={4} bg="yellow.50" borderRadius="md">
                      <Text fontWeight="600" color="yellow.700">
                        Termo de Adesão
                      </Text>
                      <Text fontSize="sm" color="yellow.600" mt={2}>
                        Ao assinar este formulário, o cooperado declara que leu e compreendeu todos os termos e condições da adesão à cooperativa.
                      </Text>
                    </Box>

                    <Box>
                      <Heading size="sm" mb={4} color="text.subtle">
                        Declarações do Cooperado
                      </Heading>
                      <VStack spacing={3} align="stretch">
                        <Checkbox colorScheme="blue">
                          Declaro que os dados informados são verdadeiros
                        </Checkbox>
                        <Checkbox colorScheme="blue">
                          Declaro que li e aceito o estatuto da cooperativa
                        </Checkbox>
                        <Checkbox colorScheme="blue">
                          Declaro que cumpro os requisitos para adesão
                        </Checkbox>
                        <Checkbox colorScheme="blue">
                          Declaro que autorizo o tratamento dos meus dados pessoais
                        </Checkbox>
                      </VStack>
                    </Box>

                    <Divider />

                    <Box>
                      <Heading size="sm" mb={4} color="text.subtle">
                        Assinatura do Cooperado
                      </Heading>
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <GridItem>
                          <FormControl isRequired>
                            <FormLabel>Local</FormLabel>
                            <Input placeholder="Belém/PA" />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl isRequired>
                            <FormLabel>Data</FormLabel>
                            <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                          </FormControl>
                        </GridItem>
                        <GridItem colSpan={2}>
                          <FormControl isRequired>
                            <FormLabel>Assinatura Digital</FormLabel>
                            <Input placeholder="URL da assinatura ou assine digitalmente" />
                          </FormControl>
                        </GridItem>
                      </Grid>
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
