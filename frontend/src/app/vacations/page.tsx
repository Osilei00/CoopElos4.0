'use client';

import {
  Box,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
  VStack,
  Icon,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Skeleton,
  SkeletonText,
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
  useToast,
} from '@chakra-ui/react';
import { HiMagnifyingGlass, HiPlus, HiCalendar } from 'react-icons/hi2';
import { MainLayout } from '@/components';
import { useVacations, useCreateVacation, useCooperados } from '@/hooks';
import { useState } from 'react';

export default function VacationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: vacations, isLoading } = useVacations();
  const { data: cooperados } = useCooperados();
  const createVacation = useCreateVacation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [newVacation, setNewVacation] = useState({
    cooperado_id: '',
    start_date: '',
    end_date: '',
  });

  const filteredData = (vacations || []).filter((item: any) => {
    const matchesSearch = !searchTerm || 
      item.cooperado?.nome_cooperado?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'green';
      case 'pending': return 'yellow';
      case 'rejected': return 'red';
      case 'scheduled': return 'blue';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovado';
      case 'pending': return 'Pendente';
      case 'rejected': return 'Rejeitado';
      case 'scheduled': return 'Agendado';
      default: return status;
    }
  };

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleCreateVacation = async () => {
    if (!newVacation.cooperado_id || !newVacation.start_date || !newVacation.end_date) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha cooperado, data início e data fim.',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    const days = calculateDays(newVacation.start_date, newVacation.end_date);
    if (days <= 0) {
      toast({
        title: 'Datas inválidas',
        description: 'A data fim deve ser posterior à data início.',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    try {
      await createVacation.mutateAsync({
        cooperado_id: newVacation.cooperado_id,
        start_date: newVacation.start_date,
        end_date: newVacation.end_date,
        days,
      });
      toast({
        title: 'Férias solicitadas',
        description: 'Solicitação de férias registrada com sucesso.',
        status: 'success',
        duration: 3000,
      });
      setNewVacation({ cooperado_id: '', start_date: '', end_date: '' });
      onClose();
    } catch {
      toast({
        title: 'Erro ao solicitar férias',
        description: 'Não foi possível registrar a solicitação.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <MainLayout>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Box>
            <Heading size="lg">
              Férias
            </Heading>
            <Text mt={1}>
              Gestão de férias dos cooperados
            </Text>
          </Box>
          <HStack spacing={3}>
            <Button leftIcon={<HiCalendar />} variant="outline">
              Calendário
            </Button>
            <Button leftIcon={<HiPlus />} colorScheme="blue" onClick={onOpen}>
              Solicitar Férias
            </Button>
          </HStack>
        </Flex>

        <Card>
          <CardBody>
            <HStack spacing={4} mb={6}>
              <InputGroup maxW="300px">
                <InputLeftElement pointerEvents="none">
                        <Icon as={HiMagnifyingGlass} color="gray.400" />
                </InputLeftElement>
                <Input 
                  placeholder="Buscar cooperado..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <Select 
                maxW="200px" 
                placeholder="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="approved">Aprovado</option>
                <option value="pending">Pendente</option>
                <option value="rejected">Rejeitado</option>
                <option value="scheduled">Agendado</option>
              </Select>
            </HStack>

            {isLoading ? (
              <VStack spacing={4} align="stretch">
                <Skeleton height="40px" />
                <SkeletonText noOfLines={4} spacing={4} />
              </VStack>
            ) : (
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Cooperado</Th>
                      <Th>Período</Th>
                      <Th isNumeric>Dias</Th>
                      <Th>Status</Th>
                      <Th>Ações</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredData.length === 0 ? (
                      <Tr>
                        <Td colSpan={5} textAlign="center" py={8}>
                          Nenhum registro encontrado
                        </Td>
                      </Tr>
                    ) : (
                      filteredData.map((item: any) => (
                        <Tr key={item.id}>
                          <Td fontWeight="500">
                            {item.cooperado?.nome_cooperado || '-'}
                          </Td>
                          <Td>
                            {item.start_date && item.end_date
                              ? `${new Date(item.start_date).toLocaleDateString('pt-BR')} a ${new Date(item.end_date).toLocaleDateString('pt-BR')}`
                              : '-'}
                          </Td>
                          <Td isNumeric>
                            {item.days_requested || item.days_used || 0} dias
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={getStatusColor(item.status)}
                              borderRadius="full"
                            >
                              {getStatusLabel(item.status)}
                            </Badge>
                          </Td>
                          <Td>
                            <Button size="sm" variant="ghost" colorScheme="blue">
                              Detalhes
                            </Button>
                          </Td>
                        </Tr>
                      ))
                    )}
                  </Tbody>
                </Table>
              </Box>
            )}
          </CardBody>
        </Card>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Solicitar Férias</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Cooperado</FormLabel>
                <Select
                  placeholder="Selecione o cooperado"
                  value={newVacation.cooperado_id}
                  onChange={(e) => setNewVacation({ ...newVacation, cooperado_id: e.target.value })}
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
                  <FormLabel>Data Início</FormLabel>
                  <Input
                    type="date"
                    value={newVacation.start_date}
                    onChange={(e) => setNewVacation({ ...newVacation, start_date: e.target.value })}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Data Fim</FormLabel>
                  <Input
                    type="date"
                    value={newVacation.end_date}
                    onChange={(e) => setNewVacation({ ...newVacation, end_date: e.target.value })}
                  />
                </FormControl>
              </HStack>

              {newVacation.start_date && newVacation.end_date && (
                <Text fontSize="sm" color="blue.600" fontWeight="medium">
                  Total: {calculateDays(newVacation.start_date, newVacation.end_date)} dia(s)
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
              onClick={handleCreateVacation}
              isLoading={createVacation.isPending}
            >
              Solicitar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </MainLayout>
  );
}
