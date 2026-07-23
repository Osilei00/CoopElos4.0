'use client';

import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Card,
  CardBody,
  Button,
  Flex,
  Input,
  Select,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  useToast,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  IconButton,
  Tooltip,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import {
  HiPlus,
  HiCurrencyDollar,
  HiDocumentArrowDown,
  HiDocumentCheck,
  HiTrash,
} from 'react-icons/hi2';
import { MainLayout } from '@/components';
import { useContribuicoes, useContribuicaoStats, useCreateContribuicao, useDeleteContribuicao, useCooperados } from '@/hooks';
import { maskCurrency } from '@/lib/masks';

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export default function ContribuicoesPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number | ''>('');
  const [filterStatus, setFilterStatus] = useState('');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { data: stats, isLoading: statsLoading } = useContribuicaoStats(selectedYear);
  const { data: contribuicoes, isLoading } = useContribuicoes({
    ano: selectedYear,
    mes: selectedMonth || undefined,
    status: filterStatus || undefined,
  });
  const { data: cooperados } = useCooperados();
  const createContribuicao = useCreateContribuicao();
  const deleteContribuicao = useDeleteContribuicao();

  const [form, setForm] = useState({
    cooperado_id: '',
    valor: '',
    mes: String(currentMonth),
    ano: String(currentYear),
    tipo: 'parcela',
    descricao: '',
  });

  const handleCreate = async () => {
    if (!form.cooperado_id || !form.valor) {
      toast({ title: 'Preencha cooperado e valor', status: 'warning', duration: 3000 });
      return;
    }

    const valorNumerico = parseFloat(form.valor.replace(/[^\d,]/g, '').replace(',', '.'));

    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      toast({ title: 'Valor deve ser maior que zero', status: 'warning', duration: 3000 });
      return;
    }

    try {
      await createContribuicao.mutateAsync({
        cooperado_id: form.cooperado_id,
        valor: valorNumerico,
        mes: parseInt(form.mes),
        ano: parseInt(form.ano),
        tipo: form.tipo,
        descricao: form.descricao || undefined,
      });
      toast({ title: 'Contribuição registrada', status: 'success', duration: 3000 });
      onClose();
      setForm({ cooperado_id: '', valor: '', mes: String(currentMonth), ano: String(currentYear), tipo: 'parcela', descricao: '' });
    } catch (error: any) {
      toast({
        title: 'Erro ao registrar',
        description: error?.response?.data?.message || 'Tente novamente.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContribuicao.mutateAsync(id);
      toast({ title: 'Contribuição removida', status: 'success', duration: 3000 });
    } catch {
      toast({ title: 'Erro ao remover', status: 'error', duration: 3000 });
    }
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <MainLayout>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Box>
            <Heading size="lg">Contribuições Financeiras</Heading>
            <Text>Controle de contribuições mensais dos cooperados</Text>
          </Box>
          <Button leftIcon={<HiPlus />} colorScheme="brand" onClick={onOpen}>
            Nova Contribuição
          </Button>
        </Flex>

        {/* Stats Cards */}
        <Flex gap={4} mb={6} flexWrap="wrap">
          <Card flex={1} minW="200px">
            <CardBody>
              <Stat>
                <StatLabel>Total Recebido ({selectedYear})</StatLabel>
                <StatNumber color="green.500" fontSize="2xl">
                  {statsLoading ? <Spinner size="sm" /> : formatCurrency(stats?.totalRecebido || 0)}
                </StatNumber>
                <StatHelpText>{stats?.totalRegistros || 0} registros</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          <Card flex={1} minW="200px">
            <CardBody>
              <Stat>
                <StatLabel>Cooperados Contribuintes</StatLabel>
                <StatNumber color="brand.500" fontSize="2xl">
                  {statsLoading ? <Spinner size="sm" /> : stats?.cooperadosUnicos || 0}
                </StatNumber>
                <StatHelpText>no ano</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          <Card flex={1} minW="200px">
            <CardBody>
              <Stat>
                <StatLabel>Mês Atual</StatLabel>
                <StatNumber color="blue.500" fontSize="2xl">
                  {statsLoading ? (
                    <Spinner size="sm" />
                  ) : (
                    formatCurrency(stats?.porMes?.find((m: any) => m.mes === currentMonth)?.total || 0)
                  )}
                </StatNumber>
                <StatHelpText>{MESES[currentMonth - 1]}</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </Flex>

        {/* Monthly Bar Chart */}
        <Card mb={6}>
          <CardBody>
            <Heading size="sm" mb={4}>Recebimentos por Mês</Heading>
            <Flex gap={2} alignItems="flex-end" height="120px">
              {stats?.porMes?.map((item: any) => {
                const maxTotal = Math.max(...(stats?.porMes?.map((m: any) => m.total) || [1]));
                const height = maxTotal > 0 ? (item.total / maxTotal) * 100 : 0;
                return (
                  <Box key={item.mes} flex={1} textAlign="center">
                    <Box
                      bg={item.mes === currentMonth ? 'brand.500' : 'brand.200'}
                      borderRadius="4px 4px 0 0"
                      height={`${Math.max(height, 4)}%`}
                      minH="4px"
                      mb={1}
                      _hover={{ bg: 'brand.400' }}
                      transition="all 0.2s"
                    />
                    <Text fontSize="xs" color="text.subtle">
                      {String(item.mes).padStart(2, '0')}
                    </Text>
                  </Box>
                );
              })}
            </Flex>
          </CardBody>
        </Card>

        {/* Filters */}
        <Card mb={4}>
          <CardBody>
            <Flex gap={4} flexWrap="wrap" alignItems="flex-end">
              <FormControl maxW="120px">
                <FormLabel fontSize="sm">Ano</FormLabel>
                <Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  size="sm"
                >
                  {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl maxW="160px">
                <FormLabel fontSize="sm">Mês</FormLabel>
                <Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value ? parseInt(e.target.value) : '')}
                  size="sm"
                  placeholder="Todos"
                >
                  {MESES.map((nome, i) => (
                    <option key={i + 1} value={i + 1}>{nome}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl maxW="140px">
                <FormLabel fontSize="sm">Status</FormLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  size="sm"
                  placeholder="Todos"
                >
                  <option value="pago">Pago</option>
                  <option value="pendente">Pendente</option>
                </Select>
              </FormControl>
            </Flex>
          </CardBody>
        </Card>

        {/* Table */}
        <Card>
          <CardBody>
            {isLoading ? (
              <Flex justify="center" py={12}><Spinner color="brand.500" /></Flex>
            ) : contribuicoes?.length === 0 ? (
              <Flex justify="center" py={12}>
                <Text color="text.subtle">Nenhuma contribuição encontrada</Text>
              </Flex>
            ) : (
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>Cooperado</Th>
                    <Th>Tipo</Th>
                    <Th>Mês/Ano</Th>
                    <Th>Valor</Th>
                    <Th>Status</Th>
                    <Th>Data Pagamento</Th>
                    <Th width="100px">Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {contribuicoes?.map((c: any, index: number) => (
                    <Tr key={c.id} _hover={{ bg: 'gray.50' }}>
                      <Td>
                        <Text fontSize="sm" fontWeight="600" color="brand.500">
                          {String(c.cooperado?.cooperado_number || index + 1).padStart(2, '0')}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm" fontWeight="500">{c.cooperado?.nome_cooperado || '-'}</Text>
                        <Text fontSize="xs" color="text.subtle">{c.cooperado?.cpf_cooperado || ''}</Text>
                      </Td>
                      <Td>
                        <Badge colorScheme={c.tipo === 'quitacao' ? 'purple' : 'blue'} fontSize="xs">
                          {c.tipo === 'quitacao' ? 'Quitação' : 'Parcela'}
                        </Badge>
                      </Td>
                      <Td>
                        <Text fontSize="sm">{String(c.mes).padStart(2, '0')}/{c.ano}</Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm" fontWeight="600" fontFamily="mono" color="green.500">
                          {formatCurrency(Number(c.valor))}
                        </Text>
                      </Td>
                      <Td>
                        <Badge colorScheme={c.status === 'pago' ? 'green' : 'yellow'} fontSize="xs">
                          {c.status === 'pago' ? 'Pago' : 'Pendente'}
                        </Badge>
                      </Td>
                      <Td>
                        <Text fontSize="sm">
                          {new Date(c.data_pagamento).toLocaleDateString('pt-BR')}
                        </Text>
                      </Td>
                      <Td>
                        <HStack spacing={1}>
                          <Tooltip label="Baixar recibo">
                            <IconButton
                              aria-label="Baixar recibo"
                              icon={<HiDocumentArrowDown />}
                              size="xs"
                              variant="ghost"
                              colorScheme="blue"
                              onClick={() => window.open(`/api/proxy/contribuicoes/${c.id}/recibo`, '_blank')}
                            />
                          </Tooltip>
                          {c.tipo === 'quitacao' && (
                            <Tooltip label="Baixar declaração de quitação">
                              <IconButton
                                aria-label="Baixar declaração de quitação"
                                icon={<HiDocumentCheck />}
                                size="xs"
                                variant="ghost"
                                colorScheme="purple"
                                onClick={() => window.open(`/api/proxy/contribuicoes/${c.id}/quitacao`, '_blank')}
                              />
                            </Tooltip>
                          )}
                          <Tooltip label="Excluir">
                            <IconButton
                              aria-label="Excluir"
                              icon={<HiTrash />}
                              size="xs"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => handleDelete(c.id)}
                            />
                          </Tooltip>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </CardBody>
        </Card>
      </Box>

      {/* Modal Nova Contribuição */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nova Contribuição</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Cooperado</FormLabel>
                <Select
                  placeholder="Selecione o cooperado"
                  value={form.cooperado_id}
                  onChange={(e) => setForm({ ...form, cooperado_id: e.target.value })}
                >
                  {cooperados?.filter((c: any) => c.status === 'active').map((c: any) => (
                    <option key={c.id} value={c.id}>
                      #{String(c.coperado_number).padStart(2, '0')} - {c.nome_cooperado}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Tipo</FormLabel>
                <Select
                  value={form.tipo}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                >
                  <option value="parcela">Parcela Quota Parte</option>
                  <option value="quitacao">Quitação Quota Parte</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Valor (R$)</FormLabel>
                <Input
                  placeholder="R$ 0,00"
                  value={form.valor}
                  onChange={(e) => setForm({ ...form, valor: maskCurrency(e.target.value) })}
                />
              </FormControl>
              <HStack spacing={4} width="100%">
                <FormControl isRequired>
                  <FormLabel>Mês</FormLabel>
                  <Select
                    value={form.mes}
                    onChange={(e) => setForm({ ...form, mes: e.target.value })}
                  >
                    {MESES.map((nome, i) => (
                      <option key={i + 1} value={i + 1}>{nome}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Ano</FormLabel>
                  <Select
                    value={form.ano}
                    onChange={(e) => setForm({ ...form, ano: e.target.value })}
                  >
                    {[currentYear, currentYear - 1].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </Select>
                </FormControl>
              </HStack>
              <FormControl>
                <FormLabel>Descrição (opcional)</FormLabel>
                <Input
                  placeholder="Ex: Contribuição mensal"
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose} mr={3}>Cancelar</Button>
            <Button
              colorScheme="brand"
              leftIcon={<HiCurrencyDollar />}
              onClick={handleCreate}
              isLoading={createContribuicao.isPending}
            >
              Registrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </MainLayout>
  );
}
