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
  Checkbox,
  IconButton,
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
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { HiMagnifyingGlass, HiPlus, HiClipboard, HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { MainLayout } from '@/components';
import { useTasks, useCompleteTask, useCreateTask } from '@/hooks';
import { useState } from 'react';

export default function TasksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data: tasks, isLoading } = useTasks(statusFilter || undefined);
  const completeTask = useCompleteTask();
  const createTask = useCreateTask();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
  });

  const filteredData = (tasks || []).filter((item: any) => {
    const matchesSearch = !searchTerm || 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !priorityFilter || item.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in_progress': return 'blue';
      case 'pending': return 'yellow';
      case 'overdue': return 'red';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'in_progress': return 'Em Andamento';
      case 'pending': return 'Pendente';
      case 'overdue': return 'Atrasada';
      default: return status;
    }
  };

  const handleCompleteTask = async (id: string) => {
    await completeTask.mutateAsync(id);
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) {
      toast({
        title: 'Título obrigatório',
        description: 'Informe o título da tarefa.',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    try {
      await createTask.mutateAsync({
        title: newTask.title,
        description: newTask.description || undefined,
        due_date: newTask.due_date || undefined,
        priority: newTask.priority,
      });
      toast({
        title: 'Tarefa criada',
        description: 'Nova tarefa adicionada com sucesso.',
        status: 'success',
        duration: 3000,
      });
      setNewTask({ title: '', description: '', due_date: '', priority: 'medium' });
      onClose();
    } catch {
      toast({
        title: 'Erro ao criar tarefa',
        description: 'Não foi possível criar a tarefa.',
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
              Tarefas
            </Heading>
            <Text mt={1}>
              Gestão de tarefas e atividades do DP
            </Text>
          </Box>
          <HStack spacing={3}>
            <Button leftIcon={<HiClipboard />} variant="outline">
              Exportar
            </Button>
            <Button leftIcon={<HiPlus />} colorScheme="blue" onClick={onOpen}>
              Nova Tarefa
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
                  placeholder="Buscar tarefa..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <Select 
                maxW="200px" 
                placeholder="Status"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="pending">Pendente</option>
                <option value="in_progress">Em Andamento</option>
                <option value="completed">Concluída</option>
                <option value="overdue">Atrasada</option>
              </Select>
              <Select 
                maxW="200px" 
                placeholder="Prioridade"
                value={priorityFilter}
                onChange={(e) => {
                  setPriorityFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="high">Alta</option>
                <option value="medium">Média</option>
                <option value="low">Baixa</option>
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
                      <Th width="40px"></Th>
                      <Th>Tarefa</Th>
                      <Th>Prioridade</Th>
                      <Th>Prazo</Th>
                      <Th>Status</Th>
                      <Th>Ações</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {paginatedData.length === 0 ? (
                      <Tr>
                        <Td colSpan={6} textAlign="center" py={8}>
                          Nenhuma tarefa encontrada
                        </Td>
                      </Tr>
                    ) : (
                      paginatedData.map((item: any) => (
                        <Tr key={item.id}>
                          <Td>
                            <Checkbox
                              isChecked={item.status === 'completed'}
                              colorScheme="green"
                              onChange={() => handleCompleteTask(item.id)}
                            />
                          </Td>
                          <Td fontWeight="500">{item.title}</Td>
                          <Td>
                            <Badge
                              colorScheme={getPriorityColor(item.priority)}
                              borderRadius="full"
                            >
                              {getPriorityLabel(item.priority)}
                            </Badge>
                          </Td>
                          <Td>
                            {item.due_date 
                              ? new Date(item.due_date).toLocaleDateString('pt-BR')
                              : '-'}
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
                              Editar
                            </Button>
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
                  {filteredData.length} tarefa(s) encontrada(s)
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

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nova Tarefa</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Título</FormLabel>
                <Input 
                  placeholder="Ex.: Verificar documentação do cooperado"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Descrição</FormLabel>
                <Textarea 
                  placeholder="Descreva detalhes da tarefa..."
                  rows={3}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </FormControl>

              <HStack spacing={4} w="full">
                <FormControl>
                  <FormLabel>Data Limite</FormLabel>
                  <Input 
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Prioridade</FormLabel>
                  <Select 
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </Select>
                </FormControl>
              </HStack>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleCreateTask}
              isLoading={createTask.isPending}
            >
              Criar Tarefa
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </MainLayout>
  );
}
