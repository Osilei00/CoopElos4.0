'use client';

import { Box, Text, VStack, Icon } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { HiOutlineDocumentText } from 'react-icons/hi2';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: IconType;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  icon: IconComponent = HiOutlineDocumentText,
  title, 
  description, 
  actionLabel,
  onAction 
}: EmptyStateProps) {
  return (
    <Box 
      p={12} 
      textAlign="center"
      bg="white"
      borderRadius="8px"
      border="1px solid"
      borderColor="border.light"
      _dark={{
        bg: 'dark.bg.secondary',
        borderColor: 'dark.border.light',
      }}
    >
      <VStack spacing={4}>
        <Box
          p={4}
          bg="gray.100"
          borderRadius="full"
          _dark={{
            bg: 'dark.bg.tertiary',
          }}
        >
          <Icon as={IconComponent} w={8} h={8} color="text.subtle" />
        </Box>
        
        <VStack spacing={2}>
          <Text 
            fontSize="lg" 
            fontWeight="600"
            color="text.primary"
          >
            {title}
          </Text>
          {description && (
            <Text 
              fontSize="sm" 
              color="text.subtle"
              maxW="400px"
            >
              {description}
            </Text>
          )}
        </VStack>

        {actionLabel && onAction && (
          <Button onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </VStack>
    </Box>
  );
}
