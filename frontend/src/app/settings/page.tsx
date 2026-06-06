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
  Switch,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  Badge,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { HiCog, HiUser, HiBuildingOffice, HiBell, HiShieldCheck, HiGlobeAlt } from 'react-icons/hi2';
import { MainLayout } from '@/components';

export default function SettingsPage() {
  return (
    <MainLayout>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Box>
            <Heading size="lg" color="text.primary">
              Configurações
            </Heading>
            <Text color="text.secondary" mt={1}>
              Preferências do sistema e da cooperativa
            </Text>
          </Box>
          <Button colorScheme="blue">
            Salvar Alterações
          </Button>
        </Flex>

        <Tabs colorScheme="blue" orientation="vertical">
          <HStack alignItems="flex-start" spacing={8}>
            <TabList w="200px" flexShrink={0}>
              <Tab justifyContent="flex-start" gap={2}>
                <Icon as={HiBuildingOffice} />
                Cooperativa
              </Tab>
              <Tab justifyContent="flex-start" gap={2}>
                <Icon as={HiUser} />
                Perfil
              </Tab>
              <Tab justifyContent="flex-start" gap={2}>
                <Icon as={HiBell} />
                Notificações
              </Tab>
              <Tab justifyContent="flex-start" gap={2}>
                <Icon as={HiShieldCheck} />
                Segurança
              </Tab>
              <Tab justifyContent="flex-start" gap={2}>
                <Icon as={HiGlobeAlt} />
                Integrações
              </Tab>
            </TabList>

            <TabPanels flex={1}>
              <TabPanel p={0}>
                <Card>
                  <CardBody>
                    <VStack spacing={6} align="stretch">
                      <Box>
                        <Heading size="md" mb={4}>
                          Dados da Cooperativa
                        </Heading>
                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                          <GridItem colSpan={2}>
                            <FormControl>
                              <FormLabel>Nome da Cooperativa</FormLabel>
                              <Input defaultValue="CoopElos 4.0" />
                            </FormControl>
                          </GridItem>
                          <GridItem>
                            <FormControl>
                              <FormLabel>CNPJ</FormLabel>
                              <Input defaultValue="00.000.000/0001-00" />
                            </FormControl>
                          </GridItem>
                          <GridItem>
                            <FormControl>
                              <FormLabel>Telefone</FormLabel>
                              <Input defaultValue="(91) 99999-9999" />
                            </FormControl>
                          </GridItem>
                          <GridItem colSpan={2}>
                            <FormControl>
                              <FormLabel>Endereço</FormLabel>
                              <Input defaultValue="Rua Example, 123 - Belém/PA" />
                            </FormControl>
                          </GridItem>
                        </Grid>
                      </Box>

                      <Divider />

                      <Box>
                        <Heading size="md" mb={4}>
                          Configurações de Pagamento
                        </Heading>
                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                          <GridItem>
                            <FormControl>
                              <FormLabel>Moeda</FormLabel>
                              <Select defaultValue="BRL">
                                <option value="BRL">Real (BRL)</option>
                                <option value="USD">Dólar (USD)</option>
                              </Select>
                            </FormControl>
                          </GridItem>
                          <GridItem>
                            <FormControl>
                              <FormLabel>Dia de Fechamento</FormLabel>
                              <Input defaultValue="25" type="number" />
                            </FormControl>
                          </GridItem>
                          <GridItem>
                            <FormControl display="flex" alignItems="center">
                              <FormLabel mb={0}>Pagamento Automático</FormLabel>
                              <Switch defaultChecked />
                            </FormControl>
                          </GridItem>
                          <GridItem>
                            <FormControl display="flex" alignItems="center">
                              <FormLabel mb={0}>Enviar Email ao Pagar</FormLabel>
                              <Switch defaultChecked />
                            </FormControl>
                          </GridItem>
                        </Grid>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              </TabPanel>

              <TabPanel p={0}>
                <Card>
                  <CardBody>
                    <VStack spacing={6} align="stretch">
                      <Box>
                        <Heading size="md" mb={4}>
                          Perfil do Usuário
                        </Heading>
                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                          <GridItem>
                            <FormControl>
                              <FormLabel>Nome</FormLabel>
                              <Input defaultValue="Administrador" />
                            </FormControl>
                          </GridItem>
                          <GridItem>
                            <FormControl>
                              <FormLabel>Email</FormLabel>
                              <Input defaultValue="admin@coopelos.com.br" type="email" />
                            </FormControl>
                          </GridItem>
                          <GridItem>
                            <FormControl>
                              <FormLabel>Cargo</FormLabel>
                              <Input defaultValue="Administrador" isReadOnly />
                            </FormControl>
                          </GridItem>
                          <GridItem>
                            <FormControl>
                              <FormLabel>Telefone</FormLabel>
                              <Input defaultValue="(91) 99999-9999" />
                            </FormControl>
                          </GridItem>
                        </Grid>
                      </Box>

                      <Divider />

                      <Box>
                        <Heading size="md" mb={4}>
                          Preferências
                        </Heading>
                        <VStack spacing={4} align="stretch">
                          <FormControl display="flex" alignItems="center" justifyContent="space-between">
                            <FormLabel mb={0}>Modo Escuro</FormLabel>
                            <Switch />
                          </FormControl>
                          <FormControl display="flex" alignItems="center" justifyContent="space-between">
                            <FormLabel mb={0}>Idioma</FormLabel>
                            <Select w="200px" defaultValue="pt-BR">
                              <option value="pt-BR">Português (Brasil)</option>
                              <option value="en">English</option>
                              <option value="es">Español</option>
                            </Select>
                          </FormControl>
                          <FormControl display="flex" alignItems="center" justifyContent="space-between">
                            <FormLabel mb={0}>Fuso Horário</FormLabel>
                            <Select w="200px" defaultValue="America/Belem">
                              <option value="America/Belem">Horário de Belém (GMT-3)</option>
                              <option value="America/Sao_Paulo">Horário de São Paulo (GMT-3)</option>
                            </Select>
                          </FormControl>
                        </VStack>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              </TabPanel>

              <TabPanel p={0}>
                <Card>
                  <CardBody>
                    <VStack spacing={6} align="stretch">
                      <Box>
                        <Heading size="md" mb={4}>
                          Preferências de Notificação
                        </Heading>
                        <VStack spacing={4} align="stretch">
                          <FormControl display="flex" alignItems="center" justifyContent="space-between">
                            <Box>
                              <FormLabel mb={0}>Notificações por Email</FormLabel>
                              <Text fontSize="sm" color="text.subtle">
                                Receber notificações importantes por email
                              </Text>
                            </Box>
                            <Switch defaultChecked />
                          </FormControl>
                          <FormControl display="flex" alignItems="center" justifyContent="space-between">
                            <Box>
                              <FormLabel mb={0}>Alertas de Prazo</FormLabel>
                              <Text fontSize="sm" color="text.subtle">
                                Notificar antes do vencimento de tarefas
                              </Text>
                            </Box>
                            <Switch defaultChecked />
                          </FormControl>
                          <FormControl display="flex" alignItems="center" justifyContent="space-between">
                            <Box>
                              <FormLabel mb={0}>Relatórios Semanais</FormLabel>
                              <Text fontSize="sm" color="text.subtle">
                                Receber resumo semanal por email
                              </Text>
                            </Box>
                            <Switch />
                          </FormControl>
                          <FormControl display="flex" alignItems="center" justifyContent="space-between">
                            <Box>
                              <FormLabel mb={0}>Alertas de Sistema</FormLabel>
                              <Text fontSize="sm" color="text.subtle">
                                Notificar sobre atualizações e manutenção
                              </Text>
                            </Box>
                            <Switch defaultChecked />
                          </FormControl>
                        </VStack>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              </TabPanel>

              <TabPanel p={0}>
                <Card>
                  <CardBody>
                    <VStack spacing={6} align="stretch">
                      <Box>
                        <Heading size="md" mb={4}>
                          Configurações de Segurança
                        </Heading>
                        <VStack spacing={4} align="stretch">
                          <FormControl display="flex" alignItems="center" justifyContent="space-between">
                            <Box>
                              <FormLabel mb={0}>Autenticação em Duas Etapas</FormLabel>
                              <Text fontSize="sm" color="text.subtle">
                                Adicionar camada extra de segurança
                              </Text>
                            </Box>
                            <Switch />
                          </FormControl>
                          <FormControl display="flex" alignItems="center" justifyContent="space-between">
                            <Box>
                              <FormLabel mb={0}>Bloqueio por IP</FormLabel>
                              <Text fontSize="sm" color="text.subtle">
                                Restringir acesso a IPs específicos
                              </Text>
                            </Box>
                            <Switch />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Tempo de Sessão (minutos)</FormLabel>
                            <Input defaultValue="480" type="number" w="200px" />
                          </FormControl>
                        </VStack>
                      </Box>

                      <Divider />

                      <Box>
                        <Heading size="md" mb={4}>
                          Senha
                        </Heading>
                        <Button variant="outline" colorScheme="red">
                          Alterar Senha
                        </Button>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              </TabPanel>

              <TabPanel p={0}>
                <Card>
                  <CardBody>
                    <VStack spacing={6} align="stretch">
                      <Box>
                        <Heading size="md" mb={4}>
                          Integrações
                        </Heading>
                        <VStack spacing={4} align="stretch">
                          <Flex justifyContent="space-between" alignItems="center" p={4} bg="gray.50" borderRadius="md">
                            <HStack>
                              <Icon as={HiGlobeAlt} w={6} h={6} color="blue.500" />
                              <Box>
                                <Text fontWeight="500">AWS S3</Text>
                                <Text fontSize="sm" color="text.subtle">
                                  Armazenamento de documentos
                                </Text>
                              </Box>
                            </HStack>
                            <Badge colorScheme="green">Conectado</Badge>
                          </Flex>
                          <Flex justifyContent="space-between" alignItems="center" p={4} bg="gray.50" borderRadius="md">
                            <HStack>
                              <Icon as={HiGlobeAlt} w={6} h={6} color="green.500" />
                              <Box>
                                <Text fontWeight="500">Email (SMTP)</Text>
                                <Text fontSize="sm" color="text.subtle">
                                  Envio de notificações
                                </Text>
                              </Box>
                            </HStack>
                            <Badge colorScheme="yellow">Configurar</Badge>
                          </Flex>
                          <Flex justifyContent="space-between" alignItems="center" p={4} bg="gray.50" borderRadius="md">
                            <HStack>
                              <Icon as={HiGlobeAlt} w={6} h={6} color="purple.500" />
                              <Box>
                                <Text fontWeight="500">Banco de Dados</Text>
                                <Text fontSize="sm" color="text.subtle">
                                  PostgreSQL + Redis
                                </Text>
                              </Box>
                            </HStack>
                            <Badge colorScheme="green">Conectado</Badge>
                          </Flex>
                        </VStack>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              </TabPanel>
            </TabPanels>
          </HStack>
        </Tabs>
      </Box>
    </MainLayout>
  );
}
