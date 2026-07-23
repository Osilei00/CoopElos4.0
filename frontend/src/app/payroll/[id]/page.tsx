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
  Grid,
  GridItem,
  Badge,
  IconButton,
  Tooltip,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stat,
  StatLabel,
  StatNumber,
  Skeleton,
  SkeletonText,
  Alert,
  AlertIcon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react';
import { HiArrowLeft, HiPrinter, HiCurrencyDollar, HiPlus } from 'react-icons/hi2';
import { MainLayout } from '@/components';
import { ExportButton } from '@/components/ExportButton';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { usePayroll, useClosePayroll, useCreatePayrollItem, useCooperados } from '@/hooks';
import { useState } from 'react';

const MONTH_NAMES = [
  '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  draft: { label: 'Rascunho', color: 'gray' },
  processing: { label: 'Processando', color: 'yellow' },
  closed: { label: 'Fechado', color: 'blue' },
  paid: { label: 'Pago', color: 'green' },
};

const formatCurrency = (value: number | string | null | undefined) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 'R$ 0,00';
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export default function PayrollDetailPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const id = params.id as string;
  const { data: payroll, isLoading, isError } = usePayroll(id);
  const closePayroll = useClosePayroll();
  const createPayrollItem = useCreatePayrollItem();
  const { data: cooperados } = useCooperados();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [newItem, setNewItem] = useState({
    cooperado_id: '',
    gross_amount: '',
    discounts: '',
  });

  const handleClose = async () => {
    try {
      await closePayroll.mutateAsync(id);
      toast({
        title: 'Folha fechada',
        description: 'A folha foi fechada com sucesso.',
        status: 'success',
        duration: 3000,
      });
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Não foi possível fechar a folha.';
      toast({
        title: 'Erro ao fechar',
        description: message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleCreateItem = async () => {
    if (!newItem.cooperado_id || !newItem.gross_amount) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Selecione o cooperado e informe o valor bruto.',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    const gross = parseFloat(newItem.gross_amount);
    const discounts = parseFloat(newItem.discounts) || 0;
    const net = gross - discounts;

    try {
      await createPayrollItem.mutateAsync({
        payrollId: id,
        data: {
          cooperado_id: newItem.cooperado_id,
          gross_amount: gross,
          discounts,
          net_amount: net,
        },
      });
      toast({
        title: 'Item adicionado',
        description: 'Item incluído na folha com sucesso.',
        status: 'success',
        duration: 3000,
      });
      setNewItem({ cooperado_id: '', gross_amount: '', discounts: '' });
      onClose();
    } catch {
      toast({
        title: 'Erro ao adicionar item',
        description: 'Não foi possível adicionar o item.',
        status: 'error',
        duration: 3000,
      });
    }
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

  if (isError || !payroll) {
    return (
      <MainLayout>
        <Box>
          <HStack spacing={4} mb={6}>
            <Tooltip label="Voltar">
              <IconButton
                as={Link}
                href="/payroll"
                aria-label="Voltar"
                icon={<HiArrowLeft />}
                variant="ghost"
              />
            </Tooltip>
            <Heading size="lg">Folha de Pagamento</Heading>
          </HStack>
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            Folha não encontrada ou erro ao carregar dados.
          </Alert>
          <Button mt={4} onClick={() => router.push('/payroll')}>
            Voltar para a lista
          </Button>
        </Box>
      </MainLayout>
    );
  }

  const items = payroll.items || [];
  const statusInfo = STATUS_MAP[payroll.status] || { label: payroll.status, color: 'gray' };
  const periodLabel = `${MONTH_NAMES[payroll.month]}/${payroll.year}`;

  return (
    <MainLayout>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <HStack spacing={4}>
            <Tooltip label="Voltar">
              <IconButton
                as={Link}
                href="/payroll"
                aria-label="Voltar"
                icon={<HiArrowLeft />}
                variant="ghost"
              />
            </Tooltip>
            <Box>
              <Heading size="lg">Folha de Pagamento</Heading>
              <Text mt={1}>{periodLabel}</Text>
            </Box>
            <Badge colorScheme={statusInfo.color}>{statusInfo.label}</Badge>
          </HStack>
          <HStack spacing={3}>
            <Button leftIcon={<HiPrinter />} variant="outline">
              Imprimir
            </Button>
            <ExportButton type="payroll" id={id} />
            {payroll.status !== 'closed' && payroll.status !== 'paid' && (
              <>
                <Button
                  leftIcon={<HiPlus />}
                  colorScheme="blue"
                  onClick={onOpen}
                >
                  Adicionar Item
                </Button>
                <Button
                  leftIcon={<HiCurrencyDollar />}
                  colorScheme="green"
                  onClick={handleClose}
                  isLoading={closePayroll.isPending}
                >
                  Fechar Folha
                </Button>
              </>
            )}
          </HStack>
        </Flex>

        <Grid templateColumns="repeat(3, 1fr)" gap={6} mb={8}>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Total Bruto</StatLabel>
                  <StatNumber fontSize="2xl" color="green.500">
                    {formatCurrency(payroll.total_gross)}
                  </StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Total Descontos</StatLabel>
                  <StatNumber fontSize="2xl" color="red.500">
                    {formatCurrency(payroll.total_discounts)}
                  </StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Total Líquido</StatLabel>
                  <StatNumber fontSize="2xl" color="purple.500">
                    {formatCurrency(payroll.total_net)}
                  </StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        <Card>
          <CardBody>
            <Heading size="sm" mb={4}>
              Itens da Folha ({items.length} cooperados)
            </Heading>
            {items.length === 0 ? (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                Nenhum item adicionado a esta folha.
              </Alert>
            ) : (
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Cooperado</Th>
                    <Th>CPF</Th>
                    <Th isNumeric>Bruto</Th>
                    <Th isNumeric>Descontos</Th>
                    <Th isNumeric>Líquido</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {items.map((item: any) => (
                    <Tr key={item.id}>
                      <Td fontWeight="500">
                        {item.cooperado?.nome_cooperado || '—'}
                      </Td>
                      <Td>{item.cooperado?.cpf_cooperado || '—'}</Td>
                      <Td isNumeric color="green.500">
                        {formatCurrency(item.gross_amount)}
                      </Td>
                      <Td isNumeric color="red.500">
                        {formatCurrency(item.discounts)}
                      </Td>
                      <Td isNumeric fontWeight="600" color="purple.500">
                        {formatCurrency(item.net_amount)}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </CardBody>
        </Card>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Adicionar Item à Folha</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Cooperado</FormLabel>
                <Select
                  placeholder="Selecione o cooperado"
                  value={newItem.cooperado_id}
                  onChange={(e) => setNewItem({ ...newItem, cooperado_id: e.target.value })}
                >
                  {(cooperados || []).map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.nome_cooperado} - {c.cpf_mascara || c.cpf}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <HStack spacing={4} w="full">
                <FormControl isRequired>
                  <FormLabel>Valor Bruto (R$)</FormLabel>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={newItem.gross_amount}
                    onChange={(e) => setNewItem({ ...newItem, gross_amount: e.target.value })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Descontos (R$)</FormLabel>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={newItem.discounts}
                    onChange={(e) => setNewItem({ ...newItem, discounts: e.target.value })}
                  />
                </FormControl>
              </HStack>

              {newItem.gross_amount && (
                <Text fontSize="sm" color="purple.600" fontWeight="medium">
                  Líquido: R${' '}
                  {(
                    parseFloat(newItem.gross_amount) - (parseFloat(newItem.discounts) || 0)
                  ).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Text>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleCreateItem}
              isLoading={createPayrollItem.isPending}
            >
              Adicionar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </MainLayout>
  );
}
