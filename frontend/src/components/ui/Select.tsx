'use client';

import { 
  Select as ChakraSelect, 
  SelectProps as ChakraSelectProps,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
} from '@chakra-ui/react';

interface SelectOption {
  value: string;
  label: string;
  isDisabled?: boolean;
}

interface SelectProps extends Omit<ChakraSelectProps, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Select({ 
  label, 
  helperText, 
  error, 
  options, 
  placeholder,
  size = 'md',
  ...props 
}: SelectProps) {
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
      <ChakraSelect
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
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.isDisabled}
          >
            {option.label}
          </option>
        ))}
      </ChakraSelect>
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
