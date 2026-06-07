'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Heading,
  Text,
  Card,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Badge,
  IconButton,
  HStack,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@chakra-ui/react';
import { HiMagnifyingGlass, HiPlus, HiPencil, HiEye, HiChevronUp, HiChevronDown, HiKey } from 'react-icons/hi2';
import { MainLayout } from '@/components';
import { useCollaborators, useSession } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';

export default function CollaboratorsPage() {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'cooperado_number' | 'nome_cooperado'>('cooperado_number');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { data: collaborators, isLoading } = useCollaborators(search || undefined);
  const { data: session, isLoading: sessionLoading } = useSession();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [resetResult, setResetResult] = useState<{ username: string; temporaryPassword: string } | null>(null);

  const isAdmin = session?.role === 'admin';

  const resetPasswordMutation = useMutation({
    mutationFn: async (collaboratorId: string) => {
      const { data } = await api.post(`/collaborators/${collaboratorId}/reset-password`);
      return data;
    },
    onSuccess: (data) => {
      setResetResult(data);
      onOpen();
      toast({ title: 'Senha resetada com sucesso', status: 'success', duration: 3000 });
    },
    onError: () => {
      toast({ title: 'Erro ao resetar senha', status: 'error', duration: 3000 });
    },
  });

  const filteredCollaborators = useMemo(() => {
    const list = collaborators || [];

    return [...list].sort((a: any, b: any) => {
      const valA = a[sortField];
      const valB = b[sortField];
      const comparison = typeof valA === 'number'
        ? valA - valB
        : String(valA || '').localeCompare(String(valB || ''), 'pt-BR');
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [collaborators, sortField, sortDirection]);

  const handleSort = (field: 'cooperado_number' | 'nome_cooperado') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: 'cooperado_number' | 'nome_cooperado' }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <HiChevronUp /> : <HiChevronDown />;
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
              Colaboradores
            </Heading>
            <Text color="text.secondary">
              Gerencie os colaboradores da cooperativa
            </Text>
          </Box>
          <Link href="/collaborators/new">
            <Button leftIcon={<HiPlus />} colorScheme="brand">
              Novo Colaborador
            </Button>
          </Link>
        </Flex>

        <Card>
          <CardBody>
            <Flex mb={4} gap={4} flexWrap="wrap">
              <InputGroup maxW="400px">
                <InputLeftElement pointerEvents="none">
                  <HiMagnifyingGlass color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Buscar por nome, CPF ou email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
            </Flex>

            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th
                    cursor="pointer"
                    userSelect="none"
                    onClick={() => handleSort('cooperado_number')}
                    _hover={{ color: 'brand.500' }}
                  >
                    <HStack spacing={1}>
                      <span>#</span>
                      <SortIcon field="cooperado_number" />
                    </HStack>
                  </Th>
                  <Th
                    cursor="pointer"
                    userSelect="none"
                    onClick={() => handleSort('nome_cooperado')}
                    _hover={{ color: 'brand.500' }}
                  >
                    <HStack spacing={1}>
                      <span>Nome</span>
                      <SortIcon field="nome_cooperado" />
                    </HStack>
                  </Th>
                  <Th>CPF</Th>
                  <Th>Cidade</Th>
                  <Th>Celular</Th>
                  <Th>Status</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  <Tr>
                    <Td colSpan={7} textAlign="center" py={8}>
                      <Spinner />
                    </Td>
                  </Tr>
                ) : filteredCollaborators?.length === 0 ? (
                  <Tr>
                    <Td colSpan={7} textAlign="center" py={8}>
                      Nenhum colaborador encontrado
                    </Td>
                  </Tr>
                ) : (
                  filteredCollaborators?.map((collaborator: any) => (
                  <Tr key={collaborator.id}>
                        <Td fontWeight="500" color="brand.500">
                          {String(collaborator.cooperado_number).padStart(2, '0')}
                        </Td>
                        <Td fontWeight="500">{collaborator.nome_cooperado}</Td>
                        <Td>{collaborator.cpf_cooperado}</Td>
                        <Td>{collaborator.cidade || '-'}</Td>
                        <Td>{collaborator.celular_cooperado || '-'}</Td>
                        <Td>
                          <Badge
                            colorScheme={
                              collaborator.status === 'active' ? 'green' : 'red'
                            }
                          >
                            {collaborator.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Link href={`/collaborators/${collaborator.id}/view`}>
                              <IconButton
                                aria-label="Visualizar"
                                icon={<HiEye />}
                                size="sm"
                                variant="ghost"
                                colorScheme="blue"
                              />
                            </Link>
                            <Link href={`/collaborators/${collaborator.id}`}>
                              <IconButton
                                aria-label="Editar"
                                icon={<HiPencil />}
                                size="sm"
                                variant="ghost"
                                colorScheme="yellow"
                              />
                            </Link>
                            <IconButton
                              aria-label="Resetar Senha"
                              icon={<HiKey />}
                              size="sm"
                              variant="ghost"
                              colorScheme="orange"
                              onClick={() => resetPasswordMutation.mutate(collaborator.id)}
                              isLoading={resetPasswordMutation.isPending}
                            />
                          </HStack>
                        </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </CardBody>
        </Card>

        {/* Reset Password Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="md">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Senha Resetada</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {resetResult && (
                <Box>
                  <Text mb={4}>A nova senha temporária foi gerada com sucesso:</Text>
                  <Card bg="gray.50" mb={4}>
                    <CardBody>
                      <Text fontWeight="bold" mb={2}>Usuário: {resetResult.username}</Text>
                      <Text fontWeight="bold" color="blue.500">Senha: {resetResult.temporaryPassword}</Text>
                    </CardBody>
                  </Card>
                  <Alert status="warning" borderRadius="md">
                    <AlertIcon />
                    <Text fontSize="sm">Anote esta senha e compartilhe de forma segura com o colaborador. Esta senha deverá ser alterada no primeiro acesso.</Text>
                  </Alert>
                </Box>
              )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={onClose}>
                Fechar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </MainLayout>
  );
}
