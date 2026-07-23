'use client';

import { Box, Input, InputProps } from '@chakra-ui/react';
import { HiMagnifyingGlass } from 'react-icons/hi2';

interface SearchInputProps extends Omit<InputProps, 'size'> {
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  onSearch?: (value: string) => void;
}

export function SearchInput({ 
  placeholder = 'Buscar...', 
  size = 'md',
  onSearch,
  ...props 
}: SearchInputProps) {
  const inputSize = {
    sm: { height: '32px', fontSize: 'sm' },
    md: { height: '40px', fontSize: 'md' },
    lg: { height: '48px', fontSize: 'lg' },
  };

  return (
    <Box position="relative">
      <Box
        position="absolute"
        left={3}
        top="50%"
        transform="translateY(-50%)"
        color="text.subtle"
        zIndex={1}
      >
        <HiMagnifyingGlass size={16} />
      </Box>
      <Input
        pl={9}
        placeholder={placeholder}
        borderRadius="6px"
        bg="white"
        _dark={{
          bg: 'dark.bg.tertiary',
          borderColor: 'dark.border.light',
          color: 'dark.text.primary',
        }}
        _focus={{
          boxShadow: '0 0 0 1px #2563eb',
        }}
        {...inputSize[size]}
        onChange={(e) => onSearch?.(e.target.value)}
        {...props}
      />
    </Box>
  );
}
