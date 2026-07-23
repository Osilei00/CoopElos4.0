'use client';

import { useState, useMemo, useRef } from 'react';
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
  Tooltip,
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import {
  HiMagnifyingGlass,
  HiPlus,
  HiPencil,
  HiEye,
  HiChevronUp,
  HiChevronDown,
  HiChevronLeft,
  HiChevronRight,
  HiTrash,
  HiDocumentText,
} from 'react-icons/hi2';
import { FaWhatsapp } from 'react-icons/fa';
import { MainLayout } from '@/components';
import { useCooperados, useDeleteCooperado } from '@/hooks';
import Link from 'next/link';

type SortField = 'cooperado_number' | 'nome_cooperado';
type SortDirection = 'asc' | 'desc';

export default function CooperadosPage() {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('cooperado_number');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const { data: cooperados, isLoading } = useCooperados(search || undefined);
  const deleteCooperado = useDeleteCooperado();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [cooperadoToDelete, setCooperadoToDelete] = useState<{ id: string; name: string } | null>(null);

  const handleDelete = async () => {
    if (!cooperadoToDelete) return;
    try {
      await deleteCooperado.mutateAsync(cooperadoToDelete.id);
      toast({
        title: 'Cooperado inativado',
        description: `${cooperadoToDelete.name} foi marcado como inativo.`,
        status: 'success',
        duration: 3000,
      });
    } catch {
      toast({
        title: 'Erro ao inativar',
        description: 'Não foi possível inativar o cooperado.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      onClose();
      setCooperadoToDelete(null);
    }
  };

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

  const totalPages = Math.ceil(sortedCooperados.length / pageSize);
  const paginatedCooperados = sortedCooperados.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setPage(1);
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
            <Heading size="lg">
              Cooperados
            </Heading>
            <Text>
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
                  <Th>Contato</Th>
                  <Th width="100px">Status</Th>
                  <Th width="100px">Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  <Tr>
                    <Td colSpan={7} textAlign="center" py={12}>
                      <Spinner color="brand.500" />
                    </Td>
                  </Tr>
                ) : paginatedCooperados.length === 0 ? (
                  <Tr>
                    <Td colSpan={7} textAlign="center" py={12}>
                      <Text>
                        Nenhum cooperado encontrado
                      </Text>
                    </Td>
                  </Tr>
                ) : (
                  paginatedCooperados.map((cooperado: any) => (
                    <Tr key={cooperado.id} _hover={{ bg: 'gray.50' }} _dark={{ _hover: { bg: 'dark.bg.tertiary' } }}>
                      <Td>
                        <Text fontWeight="600" color="brand.500" fontSize="sm">
                          {String(cooperado.cooperado_number).padStart(2, '0')}
                        </Text>
                      </Td>
                      <Td>
                        <Link href={`/cooperados/${cooperado.id}`}>
                          <Text fontWeight="500" fontSize="sm" _hover={{ textDecoration: 'underline', color: 'brand.600' }} cursor="pointer">
                            {cooperado.nome_cooperado || '-'}
                          </Text>
                        </Link>
                      </Td>
                      <Td>
                        <Text fontSize="sm">
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
                        {cooperado.celular_cooperado ? (
                          <HStack spacing={2}>
                            <Text fontSize="sm" color="text.subtle">
                              {cooperado.celular_cooperado}
                            </Text>
                            <a
                              href={`https://wa.me/55${cooperado.celular_cooperado.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Tooltip label="WhatsApp">
                                <IconButton
                                  aria-label="WhatsApp"
                                  icon={<FaWhatsapp />}
                                  size="xs"
                                  variant="ghost"
                                  colorScheme="green"
                                />
                              </Tooltip>
                            </a>
                          </HStack>
                        ) : (
                          <Text fontSize="sm">-</Text>
                        )}
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
                          <Tooltip label="Visualizar">
                            <IconButton
                              as={Link}
                              href={`/cooperados/${cooperado.id}`}
                              aria-label="Visualizar"
                              icon={<HiEye />}
                              size="xs"
                              variant="ghost"
                              colorScheme="blue"
                            />
                          </Tooltip>
                          <Tooltip label="Editar">
                            <IconButton
                              as={Link}
                              href={`/cooperados/${cooperado.id}/edit`}
                              aria-label="Editar"
                              icon={<HiPencil />}
                              size="xs"
                              variant="ghost"
                              colorScheme="yellow"
                            />
                          </Tooltip>
                          <Tooltip label="Declaração de Adesão">
                            <IconButton
                              aria-label="Declaração de Adesão"
                              icon={<HiDocumentText />}
                              size="xs"
                              variant="ghost"
                              colorScheme="purple"
                              onClick={() => window.open(`/api/proxy/cooperados/${cooperado.id}/declaracao-adesao/pdf`, '_blank')}
                            />
                          </Tooltip>
                          <Tooltip label="Excluir">
                            <IconButton
                              aria-label="Excluir"
                              icon={<HiTrash />}
                              size="xs"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => {
                                setCooperadoToDelete({
                                  id: cooperado.id,
                                  name: cooperado.nome_cooperado || 'este cooperado',
                                });
                                onOpen();
                              }}
                            />
                          </Tooltip>
                        </HStack>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>

            {!isLoading && sortedCooperados.length > 0 && (
              <Flex justifyContent="space-between" alignItems="center" mt={4} flexWrap="wrap" gap={4}>
                <Text fontSize="xs">
                  {sortedCooperados.length} cooperado(s) encontrado(s)
                  {totalPages > 1 && ` • Página ${page} de ${totalPages}`}
                </Text>
                {totalPages > 1 && (
                  <HStack spacing={2}>
                    <Button
                      size="xs"
                      leftIcon={<HiChevronLeft />}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      isDisabled={page === 1}
                      variant="outline"
                    >
                      Anterior
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                      const pageNum = start + i;
                      if (pageNum > totalPages) return null;
                      return (
                        <Button
                          key={pageNum}
                          size="xs"
                          onClick={() => setPage(pageNum)}
                          variant={page === pageNum ? 'solid' : 'outline'}
                          colorScheme={page === pageNum ? 'brand' : 'gray'}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    <Button
                      size="xs"
                      rightIcon={<HiChevronRight />}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      isDisabled={page === totalPages}
                      variant="outline"
                    >
                      Próxima
                    </Button>
                  </HStack>
                )}
              </Flex>
            )}
          </CardBody>
        </Card>
      </Box>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Inativar cooperado
            </AlertDialogHeader>
            <AlertDialogBody>
              Tem certeza que deseja inativar {cooperadoToDelete?.name || 'este cooperado'}?
              O registro não será excluído do banco, apenas marcado como inativo.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} variant="ghost">
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                isLoading={deleteCooperado.isPending}
              >
                Inativar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </MainLayout>
  );
}
