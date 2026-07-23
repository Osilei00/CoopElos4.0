'use client';

import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import { Button } from './Button';
import { IconType } from 'react-icons';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: IconType;
  actionLabel?: string;
  onAction?: () => void;
  children?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  description, 
  icon: Icon,
  actionLabel, 
  onAction,
  children 
}: PageHeaderProps) {
  return (
    <Flex 
      justifyContent="space-between" 
      alignItems="flex-start"
      mb={8}
    >
      <Flex alignItems="center" gap={4}>
        {Icon && (
          <Box
            p={3}
            bg="brand.50"
            borderRadius="8px"
            _dark={{
              bg: 'brand.900',
            }}
          >
            <Icon size={24} color="var(--chakra-colors-brand-500)" />
          </Box>
        )}
        <VStack spacing={1} align="flex-start">
          <Text 
            fontSize="2xl" 
            fontWeight="600"
            color="text.primary"
          >
            {title}
          </Text>
          {description && (
            <Text 
              fontSize="sm" 
              color="text.subtle"
            >
              {description}
            </Text>
          )}
        </VStack>
      </Flex>

      <Flex gap={3}>
        {children}
        {actionLabel && onAction && (
          <Button onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
