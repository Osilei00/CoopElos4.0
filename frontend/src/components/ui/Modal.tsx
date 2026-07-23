'use client';

import {
  Modal as ChakraModal,
  ModalProps as ChakraModalProps,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
} from '@chakra-ui/react';

interface ModalProps extends Omit<ChakraModalProps, 'size'> {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  onClose: () => void;
}

export function Modal({ 
  title, 
  children, 
  footer, 
  size = 'md',
  onClose,
  ...props 
}: ModalProps) {
  return (
    <ChakraModal size={size} onClose={onClose} {...props}>
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent
        borderRadius="8px"
        bg="white"
        _dark={{
          bg: 'dark.bg.secondary',
        }}
      >
        <ModalHeader 
          borderBottom="1px solid"
          borderColor="border.light"
          _dark={{
            borderColor: 'dark.border.light',
          }}
        >
          {title}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6}>
          {children}
        </ModalBody>
        {footer && (
          <ModalFooter 
            borderTop="1px solid"
            borderColor="border.light"
            _dark={{
              borderColor: 'dark.border.light',
            }}
          >
            {footer}
          </ModalFooter>
        )}
      </ModalContent>
    </ChakraModal>
  );
}
