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
  SkeletonText,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  useDisclosure,
  Alert,
  AlertIcon,
  Spinner,
} from '@chakra-ui/react';
import { HiPlus, HiMagnifyingGlass, HiPencil, HiTrash } from 'react-icons/hi2';
import { MainLayout } from '@/components';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useSession } from '@/hooks';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

const roleLabels: Record<string, string> = {
  admin: 'Administrador',
  rh: 'RH',
  dp: 'DP',
  viewer: 'Visualizador',
};

const roleColors: Record<string, string> = {
  admin: 'red',
  rh: 'blue',
  dp: 'green',
  viewer: 'gray',
};

export default function UsersPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'viewer',
  });

  const { data: session, isLoading: sessionLoading } = useSession();
  const isAdmin = session?.role === 'admin';

  const { data: users, isLoading } = useQuery({
    queryKey: ['users', search],
    queryFn: async () => {
      const { data } = await api.get('/users', { params: { search } });
      return data as User[];
    },
    enabled: isAdmin,
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: result } = await api.post('/users', data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'Usuário criado', status: 'success', duration: 3000 });
      onClose();
      resetForm();
    },
    onError: () => {
      toast({ title: 'Erro ao criar usuário', status: 'error', duration: 3000 });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: result } = await api.put(`/users/${id}`, data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'Usuário atualizado', status: 'success', duration: 3000 });
      onClose();
      resetForm();
    },
    onError: () => {
      toast({ title: 'Erro ao atualizar usuário', status: 'error', duration: 3000 });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'Usuário removido', status: 'info', duration: 3000 });
    },
  });

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', role: 'viewer' });
    setEditingUser(null);
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    } else {
      resetForm();
    }
    onOpen();
  };

  const handleSubmit = () => {
    if (editingUser) {
      const { password, ...data } = formData;
      updateMutation.mutate({ id: editingUser.id, data });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (sessionLoading) {
    return (
      <MainLayout>
        <Box textAlign="center" py={10}>
          <Spinner />
        </Box>
      </MainLayout>
    );
  }

  if (!isAdmin) {
    return (
      <MainLayout>
        <Box>
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            Acesso restrito. Apenas administradores podem acessar esta página.
          </Alert>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Box>
            <Heading size="lg" color="text.primary">
              Gestão de Usuários
            </Heading>
            <Text color="text.secondary" mt={1}>
              Gerencie os usuários do sistema
            </Text>
          </Box>
          <Button
            leftIcon={<HiPlus />}
            colorScheme="blue"
            onClick={() => handleOpenModal()}
          >
            Novo Usuário
          </Button>
        </Flex>

        <Card>
          <CardBody>
            <HStack spacing={4} mb={6}>
              <Box position="relative">
                <Input
                  placeholder="Buscar usuários..."
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
                    <Th>Nome</Th>
                    <Th>Email</Th>
                    <Th>Perfil</Th>
                    <Th>Status</Th>
                    <Th>Último Login</Th>
                    <Th>Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users?.map((user) => (
                    <Tr key={user.id}>
                      <Td fontWeight="medium">{user.name}</Td>
                      <Td>{user.email}</Td>
                      <Td>
                        <Badge colorScheme={roleColors[user.role]}>
                          {roleLabels[user.role]}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge colorScheme={user.is_active ? 'green' : 'red'}>
                          {user.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </Td>
                      <Td>
                        {user.last_login
                          ? new Date(user.last_login).toLocaleDateString('pt-BR')
                          : 'Nunca'}
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <IconButton
                            aria-label="Editar"
                            icon={<HiPencil />}
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenModal(user)}
                          />
                          <IconButton
                            aria-label="Excluir"
                            icon={<HiTrash />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => deleteMutation.mutate(user.id)}
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
            <ModalHeader>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Nome</FormLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </FormControl>
                {!editingUser && (
                  <FormControl isRequired>
                    <FormLabel>Senha</FormLabel>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </FormControl>
                )}
                <FormControl isRequired>
                  <FormLabel>Perfil</FormLabel>
                  <Select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="admin">Administrador</option>
                    <option value="rh">RH</option>
                    <option value="dp">DP</option>
                    <option value="viewer">Visualizador</option>
                  </Select>
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
                {editingUser ? 'Salvar' : 'Criar'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </MainLayout>
  );
}
