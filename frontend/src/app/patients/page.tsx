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
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  useToast,
  Skeleton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useDisclosure,
} from '@chakra-ui/react';
import { HiPlus, HiMagnifyingGlass, HiPencil, HiTrash } from 'react-icons/hi2';
import { MainLayout } from '@/components';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface Patient {
  id: string;
  name: string;
  code: string | null;
  created_at: string;
}

export default function PatientsPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState('');
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({ name: '', code: '' });

  const { data: patients, isLoading } = useQuery({
    queryKey: ['patients', search],
    queryFn: async () => {
      const { data } = await api.get('/patients', { params: { search } });
      return data as Patient[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: result } = await api.post('/patients', data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast({ title: 'Paciente criado', status: 'success', duration: 3000 });
      onClose();
      resetForm();
    },
    onError: () => {
      toast({ title: 'Erro ao criar paciente', status: 'error', duration: 3000 });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: result } = await api.put(`/patients/${id}`, data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast({ title: 'Paciente atualizado', status: 'success', duration: 3000 });
      onClose();
      resetForm();
    },
    onError: () => {
      toast({ title: 'Erro ao atualizar paciente', status: 'error', duration: 3000 });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/patients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast({ title: 'Paciente removido', status: 'info', duration: 3000 });
    },
  });

  const resetForm = () => {
    setFormData({ name: '', code: '' });
    setEditingPatient(null);
  };

  const handleOpenModal = (patient?: Patient) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData({ name: patient.name, code: patient.code || '' });
    } else {
      resetForm();
    }
    onOpen();
  };

  const handleSubmit = () => {
    if (editingPatient) {
      updateMutation.mutate({ id: editingPatient.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <MainLayout>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Box>
            <Heading size="lg" color="text.primary">
              Pacientes
            </Heading>
            <Text color="text.secondary" mt={1}>
              Gestão de pacientes para atendimento domiciliar
            </Text>
          </Box>
          <Button
            leftIcon={<HiPlus />}
            colorScheme="blue"
            onClick={() => handleOpenModal()}
          >
            Novo Paciente
          </Button>
        </Flex>

        <Card>
          <CardBody>
            <HStack spacing={4} mb={6}>
              <Box position="relative">
                <Input
                  placeholder="Buscar pacientes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  maxW="400px"
                  pl={10}
                />
                <Icon
                  as={HiMagnifyingGlass}
                  position="absolute"
                  left={3}
                  top="50%"
                  transform="translateY(-50%)"
                  color="gray.400"
                />
              </Box>
            </HStack>

            {isLoading ? (
              <VStack spacing={4} align="stretch">
                <Skeleton h="40px" />
                <Skeleton h="40px" />
                <Skeleton h="40px" />
              </VStack>
            ) : (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Código</Th>
                    <Th>Nome</Th>
                    <Th>Cadastro</Th>
                    <Th>Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {patients?.map((patient) => (
                    <Tr key={patient.id}>
                      <Td>
                        <Badge colorScheme="blue">{patient.code || '-'}</Badge>
                      </Td>
                      <Td fontWeight="medium">{patient.name}</Td>
                      <Td>
                        {new Date(patient.created_at).toLocaleDateString('pt-BR')}
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <IconButton
                            aria-label="Editar"
                            icon={<HiPencil />}
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenModal(patient)}
                          />
                          <IconButton
                            aria-label="Excluir"
                            icon={<HiTrash />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => deleteMutation.mutate(patient.id)}
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </CardBody>
        </Card>

        {/* Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="md">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{editingPatient ? 'Editar Paciente' : 'Novo Paciente'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Nome</FormLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nome do paciente"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Código</FormLabel>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Ex: P001"
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                isLoading={createMutation.isPending || updateMutation.isPending}
              >
                {editingPatient ? 'Salvar' : 'Criar'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </MainLayout>
  );
}
