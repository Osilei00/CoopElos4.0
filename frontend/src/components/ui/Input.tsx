'use client';

import { 
  Input as ChakraInput, 
  InputProps as ChakraInputProps,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Box,
} from '@chakra-ui/react';
import { IconType } from 'react-icons';

interface InputProps extends Omit<ChakraInputProps, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: IconType;
  size?: 'sm' | 'md' | 'lg';
}

export function Input({ 
  label, 
  helperText, 
  error, 
  icon: Icon, 
  size = 'md',
  ...props 
}: InputProps) {
  const inputSize = {
    sm: { height: '32px', fontSize: 'sm' },
    md: { height: '40px', fontSize: 'md' },
    lg: { height: '48px', fontSize: 'lg' },
  };

  return (
    <FormControl isInvalid={!!error}>
      {label && (
        <FormLabel 
          fontSize="sm" 
          fontWeight="500"
          color="text.secondary"
        >
          {label}
        </FormLabel>
      )}
      <Box position="relative">
        {Icon && (
          <Box
            position="absolute"
            left={3}
            top="50%"
            transform="translateY(-50%)"
            color="text.subtle"
            zIndex={1}
          >
            <Icon size={16} />
          </Box>
        )}
        <ChakraInput
          size={size}
          borderRadius="6px"
          bg="white"
          _dark={{
            bg: 'dark.bg.tertiary',
            borderColor: 'dark.border.light',
            color: 'dark.text.primary',
          }}
          pl={Icon ? '2.5rem' : undefined}
          _focus={{
            boxShadow: '0 0 0 1px #2563eb',
          }}
          {...inputSize[size]}
          {...props}
        />
      </Box>
      {helperText && !error && (
        <FormHelperText fontSize="xs" color="text.subtle">
          {helperText}
        </FormHelperText>
      )}
      {error && (
        <FormErrorMessage fontSize="xs">{error}</FormErrorMessage>
      )}
    </FormControl>
  );
}
