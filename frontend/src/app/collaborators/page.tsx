'use client';

import { useState, useCallback } from 'react';
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
  Select,
  Spinner,
} from '@chakra-ui/react';
import { HiMagnifyingGlass, HiPlus, HiPencil, HiEye } from 'react-icons/hi2';
import { MainLayout } from '@/components';
import { useCollaborators } from '@/hooks';
import Link from 'next/link';

export default function CollaboratorsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { data: collaborators, isLoading } = useCollaborators(search || undefined);

  const filteredCollaborators = collaborators?.filter((collaborator: any) => {
    if (statusFilter === 'all') return true;
    return collaborator.status === statusFilter;
  });

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
              <Select
                maxW="200px"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
              </Select>
            </Flex>

            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Nome</Th>
                  <Th>CPF</Th>
                  <Th>Cargo</Th>
                  <Th>Status</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  <Tr>
                    <Td colSpan={6} textAlign="center" py={8}>
                      <Spinner />
                    </Td>
                  </Tr>
                ) : filteredCollaborators?.length === 0 ? (
                  <Tr>
                    <Td colSpan={6} textAlign="center" py={8}>
                      Nenhum colaborador encontrado
                    </Td>
                  </Tr>
                ) : (
                  filteredCollaborators?.map((collaborator: any) => (
                  <Tr key={collaborator.id}>
                        <Td fontWeight="500" color="brand.500">
                          {String(collaborator.collaborator_number).padStart(2, '0')}
                        </Td>
                        <Td fontWeight="500">{collaborator.full_name}</Td>
                        <Td>{collaborator.cpf}</Td>
                      <Td>{collaborator.adhesion_form?.desired_position || '-'}</Td>
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
                          <Link href={`/collaborators/${collaborator.id}`}>
                            <IconButton
                              aria-label="Ver detalhes"
                              icon={<HiEye />}
                              size="sm"
                              variant="ghost"
                            />
                          </Link>
                          <Link href={`/collaborators/${collaborator.id}/edit`}>
                            <IconButton
                              aria-label="Editar"
                              icon={<HiPencil />}
                              size="sm"
                              variant="ghost"
                            />
                          </Link>
                        </HStack>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </Box>
    </MainLayout>
  );
}
