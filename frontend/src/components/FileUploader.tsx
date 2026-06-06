'use client';

import { useCallback, useState, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Button,
  List,
  ListItem,
  ListIcon,
  Progress,
  IconButton,
  useToast,
  Badge,
} from '@chakra-ui/react';
import {
  HiArrowUpTray,
  HiDocument,
  HiPhoto,
  HiXMark,
  HiArrowDownTray,
  HiTrash,
} from 'react-icons/hi2';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface Document {
  id: string;
  name: string;
  file_key: string;
  file_url: string | null;
  mime_type: string | null;
  file_size: number | null;
  created_at: string;
}

interface FileUploaderProps {
  collaboratorId: string;
  onUploadComplete?: (document: Document) => void;
}

const formatFileSize = (bytes: number | null): string => {
  if (!bytes) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

const getFileIcon = (mimeType: string | null) => {
  if (!mimeType) return HiDocument;
  if (mimeType.startsWith('image/')) return HiPhoto;
  return HiDocument;
};

export function FileUploader({ collaboratorId, onUploadComplete }: FileUploaderProps) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  // Fetch documents
  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents', collaboratorId],
    queryFn: async () => {
      const { data } = await api.get(`/documents/collaborator/${collaboratorId}`);
      return data as Document[];
    },
    enabled: !!collaboratorId,
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress
      const progressKey = `${file.name}-${Date.now()}`;
      setUploadProgress((prev) => ({ ...prev, [progressKey]: 0 }));

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const current = prev[progressKey] || 0;
          if (current >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, [progressKey]: current + 10 };
        });
      }, 200);

      try {
        const { data } = await api.post(
          `/documents/upload/${collaboratorId}`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        clearInterval(progressInterval);
        setUploadProgress((prev) => ({ ...prev, [progressKey]: 100 }));
        return data as Document;
      } catch (error) {
        clearInterval(progressInterval);
        setUploadProgress((prev) => {
          const { [progressKey]: _, ...rest } = prev;
          return rest;
        });
        throw error;
      }
    },
    onSuccess: (document) => {
      queryClient.invalidateQueries({ queryKey: ['documents', collaboratorId] });
      toast({ title: 'Arquivo enviado com sucesso', status: 'success', duration: 3000 });
      onUploadComplete?.(document);
      // Clear progress after a delay
      setTimeout(() => setUploadProgress({}), 1000);
    },
    onError: () => {
      toast({ title: 'Erro ao enviar arquivo', status: 'error', duration: 3000 });
      setUploadProgress({});
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/documents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', collaboratorId] });
      toast({ title: 'Arquivo removido', status: 'info', duration: 3000 });
    },
  });

  // Download mutation
  const downloadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.get(`/documents/${id}/download`);
      return data as { url: string };
    },
    onSuccess: (data) => {
      window.open(data.url, '_blank');
    },
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      files.forEach((file) => uploadMutation.mutate(file));
    },
    [uploadMutation]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      files.forEach((file) => uploadMutation.mutate(file));
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [uploadMutation]
  );

  const progressEntries = Object.entries(uploadProgress);

  return (
    <VStack spacing={4} align="stretch">
      {/* Drop Zone */}
      <Box
        border="2px dashed"
        borderColor={isDragging ? 'blue.400' : 'gray.200'}
        borderRadius="8px"
        p={6}
        textAlign="center"
        bg={isDragging ? 'blue.50' : 'gray.50'}
        cursor="pointer"
        transition="all 0.2s"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        _hover={{ borderColor: 'blue.300', bg: 'blue.50' }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
        />
        <VStack spacing={2}>
          <Icon as={HiArrowUpTray} w={8} h={8} color="gray.400" />
          <Text color="gray.600" fontWeight="medium">
            Arraste arquivos aqui ou clique para selecionar
          </Text>
          <Text color="gray.400" fontSize="sm">
            PDF, Word, Excel, Imagens (máx. 10MB)
          </Text>
        </VStack>
      </Box>

      {/* Upload Progress */}
      {progressEntries.length > 0 && (
        <Box>
          <Text fontSize="sm" color="gray.500" mb={2}>
            Enviando arquivo...
          </Text>
          {progressEntries.map(([key, progress]) => (
            <Progress
              key={key}
              value={progress}
              size="sm"
              colorScheme="blue"
              borderRadius="full"
              mb={2}
            />
          ))}
        </Box>
      )}

      {/* Document List */}
      {documents && documents.length > 0 && (
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
            Arquivos ({documents.length})
          </Text>
          <List spacing={2}>
            {documents.map((doc) => (
              <ListItem
                key={doc.id}
                p={3}
                bg="white"
                border="1px solid"
                borderColor="gray.100"
                borderRadius="6px"
                _hover={{ bg: 'gray.50' }}
              >
                <HStack justify="space-between">
                  <HStack spacing={3} flex={1} minW={0}>
                    <ListIcon
                      as={getFileIcon(doc.mime_type)}
                      color="blue.500"
                      w={5}
                      h={5}
                    />
                    <VStack align="start" spacing={0} minW={0}>
                      <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                        {doc.name}
                      </Text>
                      <HStack spacing={2}>
                        <Badge fontSize="xs" colorScheme="gray">
                          {formatFileSize(doc.file_size)}
                        </Badge>
                        {doc.mime_type && (
                          <Badge fontSize="xs" colorScheme="blue">
                            {doc.mime_type.split('/')[1]?.toUpperCase() || 'FILE'}
                          </Badge>
                        )}
                      </HStack>
                    </VStack>
                  </HStack>
                  <HStack spacing={1}>
                    <IconButton
                      aria-label="Download"
                      icon={<HiArrowDownTray />}
                      size="sm"
                      variant="ghost"
                      onClick={() => downloadMutation.mutate(doc.id)}
                      isLoading={downloadMutation.isPending}
                    />
                    <IconButton
                      aria-label="Excluir"
                      icon={<HiTrash />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => deleteMutation.mutate(doc.id)}
                      isLoading={deleteMutation.isPending}
                    />
                  </HStack>
                </HStack>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Empty State */}
      {!isLoading && documents && documents.length === 0 && progressEntries.length === 0 && (
        <Box textAlign="center" py={4}>
          <Text color="gray.400" fontSize="sm">
            Nenhum arquivo anexado
          </Text>
        </Box>
      )}
    </VStack>
  );
}
