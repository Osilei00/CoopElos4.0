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
} from '@chakra-ui/react';
import {
  HiMagnifyingGlass,
  HiPlus,
  HiPencil,
  HiEye,
  HiChevronUp,
  HiChevronDown,
} from 'react-icons/hi2';
import { MainLayout } from '@/components';
import { useCooperados } from '@/hooks';
import Link from 'next/link';

type SortField = 'cooperado_number' | 'nome_cooperado';
type SortDirection = 'asc' | 'desc';

export default function CooperadosPage() {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('cooperado_number');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const { data: cooperados, isLoading } = useCooperados(search || undefined);

  const sortedCooperados = useMemo(() => {
    const list = cooperados || [];
    return [...list].sort((a: any, b: any) => {
      const valA = a[sortField];
      const valB = b[sortField];
      const comparison =
        typeof valA === 'number'
          ? valA - valB
          : String(valA || '').localeCompare(String(valB || ''), 'pt-BR');
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [cooperados, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <HiChevronUp style={{ display: 'inline' }} />
    ) : (
      <HiChevronDown style={{ display: 'inline' }} />
    );
  };

  return (
    <MainLayout>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Box>
            <Heading size="lg" color="text.primary">
              Cooperados
            </Heading>
            <Text color="text.secondary">
              Lista completa de cooperados cadastrados
            </Text>
          </Box>
          <Link href="/cooperados/new">
            <Button leftIcon={<HiPlus />} colorScheme="brand">
              Novo Cooperado
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

            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th
                    cursor="pointer"
                    userSelect="none"
                    onClick={() => handleSort('cooperado_number')}
                    _hover={{ color: 'brand.500' }}
                    width="60px"
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
                  <Th>Cargo</Th>
                  <Th width="100px">Status</Th>
                  <Th width="100px">Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  <Tr>
                    <Td colSpan={6} textAlign="center" py={12}>
                      <Spinner color="brand.500" />
                    </Td>
                  </Tr>
                ) : sortedCooperados.length === 0 ? (
                  <Tr>
                    <Td colSpan={6} textAlign="center" py={12}>
                      <Text color="text.subtle">
                        Nenhum cooperado encontrado
                      </Text>
                    </Td>
                  </Tr>
                ) : (
                  sortedCooperados.map((cooperado: any) => (
                    <Tr key={cooperado.id} _hover={{ bg: 'gray.50' }}>
                      <Td>
                        <Text fontWeight="600" color="brand.500" fontSize="sm">
                          {String(cooperado.cooperado_number).padStart(2, '0')}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontWeight="500" fontSize="sm">
                          {cooperado.nome_cooperado || '-'}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="text.subtle">
                          {cooperado.cpf_cooperado || '-'}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm">
                          {cooperado.cargo_pretendido ||
                            cooperado.cargo_contratado ||
                            '-'}
                        </Text>
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={
                            cooperado.status === 'active' ? 'green' : 'red'
                          }
                          fontSize="xs"
                          px={2}
                          py={1}
                          borderRadius="full"
                        >
                          {cooperado.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </Td>
                      <Td>
                        <HStack spacing={1}>
                          <Link href={`/cooperados/${cooperado.id}`}>
                            <IconButton
                              aria-label="Visualizar"
                              icon={<HiEye />}
                              size="xs"
                              variant="ghost"
                              colorScheme="blue"
                            />
                          </Link>
                          <Link href={`/cooperados/${cooperado.id}/edit`}>
                            <IconButton
                              aria-label="Editar"
                              icon={<HiPencil />}
                              size="xs"
                              variant="ghost"
                              colorScheme="yellow"
                            />
                          </Link>
                        </HStack>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>

            {!isLoading && sortedCooperados.length > 0 && (
              <Flex justifyContent="flex-end" mt={4}>
                <Text fontSize="xs" color="text.subtle">
                  {sortedCooperados.length} cooperado(s) encontrado(s)
                </Text>
              </Flex>
            )}
          </CardBody>
        </Card>
      </Box>
    </MainLayout>
  );
}
