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
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  Code,
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react';
import { HiMagnifyingGlass, HiShieldCheck, HiDocumentText, HiUserGroup, HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { MainLayout } from '@/components';
import { useSession, useAuditLogs } from '@/hooks';
import { useState } from 'react';

export default function AuditPage() {
  const { data: session } = useSession();
  const isAdmin = session?.role === 'admin';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data: auditLogs, isLoading } = useAuditLogs(entityFilter || undefined);

  const filteredData = (auditLogs || []).filter((item: any) => {
    const matchesSearch = !searchTerm || 
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = !actionFilter || item.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'green';
      case 'UPDATE': return 'blue';
      case 'DELETE': return 'red';
      case 'LOGIN': return 'purple';
      case 'EXPORT': return 'yellow';
      default: return 'gray';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'CREATE': return 'Criar';
      case 'UPDATE': return 'Atualizar';
      case 'DELETE': return 'Excluir';
      case 'LOGIN': return 'Login';
      case 'EXPORT': return 'Exportar';
      default: return action;
    }
  };

  return (
    <MainLayout>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Box>
            <Heading size="lg">
              Auditoria
            </Heading>
            <Text mt={1}>
              Histórico de ações e alterações no sistema
            </Text>
          </Box>
           <HStack spacing={3}>
             {isAdmin && (
               <Button leftIcon={<HiDocumentText />} variant="outline">
                 Exportar Log
               </Button>
             )}
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
                  placeholder="Buscar na auditoria..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <Select 
                maxW="200px" 
                placeholder="Ação"
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="CREATE">Criar</option>
                <option value="UPDATE">Atualizar</option>
                <option value="DELETE">Excluir</option>
                <option value="LOGIN">Login</option>
                <option value="EXPORT">Exportar</option>
              </Select>
              <Select 
                maxW="200px" 
                placeholder="Entidade"
                value={entityFilter}
                onChange={(e) => {
                  setEntityFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="cooperado">Cooperado</option>
                <option value="payroll">Pagamento</option>
                <option value="task">Tarefa</option>
                <option value="auth">Autenticação</option>
                <option value="report">Relatório</option>
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
                      <Th>Usuário</Th>
                      <Th>Ação</Th>
                      <Th>Entidade</Th>
                      <Th>Detalhes</Th>
                      <Th>Data/Hora</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {paginatedData.length === 0 ? (
                      <Tr>
                        <Td colSpan={5} textAlign="center" py={8}>
                          Nenhum registro encontrado
                        </Td>
                      </Tr>
                    ) : (
                      paginatedData.map((item: any) => (
                        <Tr key={item.id}>
                          <Td fontWeight="500">
                            {item.user?.name || '-'}
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={getActionColor(item.action)}
                              borderRadius="full"
                            >
                              {getActionLabel(item.action)}
                            </Badge>
                          </Td>
                          <Td>
                            <Code fontSize="xs">{item.table_name}</Code>
                          </Td>
                          <Td maxW="300px" isTruncated>
                            {item.description}
                          </Td>
                          <Td fontSize="sm">
                            {new Date(item.created_at).toLocaleString('pt-BR')}
                          </Td>
                        </Tr>
                      ))
                    )}
                  </Tbody>
                </Table>
              </Box>
            )}

            {!isLoading && filteredData.length > 0 && (
              <Flex justifyContent="space-between" alignItems="center" mt={4} flexWrap="wrap" gap={4}>
                <Text fontSize="xs">
                  {filteredData.length} registro(s) encontrado(s)
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
                          colorScheme={page === pageNum ? 'blue' : 'gray'}
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
    </MainLayout>
  );
}
