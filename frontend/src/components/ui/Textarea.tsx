'use client';

import { 
  Textarea as ChakraTextarea, 
  TextareaProps as ChakraTextareaProps,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
} from '@chakra-ui/react';

interface TextareaProps extends Omit<ChakraTextareaProps, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Textarea({ 
  label, 
  helperText, 
  error, 
  size = 'md',
  ...props 
}: TextareaProps) {
  const inputSize = {
    sm: { minH: '60px', fontSize: 'sm' },
    md: { minH: '80px', fontSize: 'md' },
    lg: { minH: '120px', fontSize: 'lg' },
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
      <ChakraTextarea
        size={size}
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
        {...props}
      />
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
