'use client';

import {
  FormControl,
  FormLabel,
  Checkbox,
  VStack,
  HStack,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  useDisclosure,
  Box,
  IconButton,
  Link,
} from '@chakra-ui/react';
import { HiDocumentArrowUp, HiXMark } from 'react-icons/hi2';
import { useState, useRef } from 'react';

interface DocumentCheckboxGroupProps {
  label: string;
  value: string | null | undefined;
  onChange: (value: string | null) => void;
}

export function DocumentCheckboxGroup({ label, value, onChange }: DocumentCheckboxGroupProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDoc, setSelectedDoc] = useState('');
  const [tempUrl, setTempUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, string>>(() => {
    if (!value) return {};
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  });

  const docs = ['Carteira de Registro', 'Atestados Técnicos', 'Currículo Profissional'];

  const saveToField = (docs: Record<string, string>) => {
    const hasAny = Object.values(docs).some((v) => v);
    onChange(hasAny ? JSON.stringify(docs) : null);
  };

  const handleCheck = (doc: string, checked: boolean) => {
    if (checked) {
      setSelectedDoc(doc);
      setTempUrl(checkedDocs[doc] || '');
      onOpen();
    } else {
      const updated = { ...checkedDocs };
      delete updated[doc];
      setCheckedDocs(updated);
      saveToField(updated);
    }
  };

  const handleSave = () => {
    const updated = { ...checkedDocs, [selectedDoc]: tempUrl };
    setCheckedDocs(updated);
    saveToField(updated);
    setTempUrl('');
    onClose();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <FormControl>
      <FormLabel fontSize="sm" fontWeight="600">{label}</FormLabel>
      <VStack spacing={3} align="stretch">
        {docs.map((doc) => (
          <HStack key={doc} justify="space-between">
            <Checkbox
              size="sm"
              isChecked={!!checkedDocs[doc]}
              onChange={(e) => handleCheck(doc, e.target.checked)}
            >
              <Text fontSize="sm">{doc}</Text>
            </Checkbox>
            {checkedDocs[doc] && (
              <HStack spacing={1}>
                <Link href={checkedDocs[doc]} isExternal fontSize="xs" color="brand.500">
                  Ver arquivo
                </Link>
                <IconButton
                  aria-label="Remover"
                  icon={<HiXMark />}
                  size="xs"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => {
                    const updated = { ...checkedDocs };
                    delete updated[doc];
                    setCheckedDocs(updated);
                    saveToField(updated);
                  }}
                />
              </HStack>
            )}
          </HStack>
        ))}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedDoc}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm">Envie o arquivo digitalizado ou cole a URL:</Text>
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                display="none"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <Button
                leftIcon={<HiDocumentArrowUp />}
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                size="sm"
              >
                Selecionar arquivo
              </Button>
              <Text fontSize="xs" color="text.subtle">ou</Text>
              <Input
                placeholder="https://exemplo.com/arquivo.pdf"
                value={tempUrl.startsWith('data:') ? '' : tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                size="sm"
                isDisabled={tempUrl.startsWith('data:')}
              />
              {tempUrl && (
                <Box>
                  <Text fontSize="xs" color="green.500">
                    {tempUrl.startsWith('data:') ? 'Arquivo selecionado' : 'URL informada'}
                  </Text>
                </Box>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancelar</Button>
            <Button colorScheme="brand" onClick={handleSave} isDisabled={!tempUrl}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </FormControl>
  );
}
